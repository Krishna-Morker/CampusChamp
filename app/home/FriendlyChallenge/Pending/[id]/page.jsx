"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PedingChallengePage = ({ params }) => {
    const { id } = use(params);
    const [challengeId, setChallengeId] = useState(null);
    const [challenge, setChallenge] = useState([]);
    const { user } = useUser();
    const [dbUser, setDbUser] = useState(null);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // Timer state
    const [userResponses, setUserResponses] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canTake, setCanTake] = useState(false);
    const router = useRouter();

    // Fetch challenge details
    useEffect(() => {
        if (challengeId) {
            const fetchChallenge = async () => {
                try {
                    const ge = "getSingle";
                    const response = await axios.post('/api/friendlychallenge', { ge, challengeId });
                    setChallenge(response.data);
                } catch (error) {
                    console.log("Error fetching challenge:", error);
                }
            };
            fetchChallenge();
        }
    }, [challengeId]);

    useEffect(() => {
        if (id) setChallengeId(id);
    }, [id]);

    useEffect(() => {
        if (user) {
            const fetchUser = async () => {
                try {
                    const response = await axios.post('/api/user', { id: user.id });
                    setDbUser(response.data);
                } catch (error) {
                    console.log("Error fetching user:", error);
                }
            };
            fetchUser();
        }
    }, [user]);

    // Start quiz and timer
    const startQuiz = () => {
        setIsQuizStarted(true);
        setTimeLeft(5 * 60); // Set 5 minutes in seconds

        // Start the countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsQuizStarted(false); // End the quiz when time is up
                    handleSubmit(); // Automatically submit the quiz when the time runs out
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResponseChange = (questionId, option) => {
        setUserResponses((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const currentUserId = user.id;
        const isChallenger = challenge[0].challengerId?.clerkId === currentUserId;

        const responses = {
            challengeId,
            userType: isChallenger ? "challenger" : "challenged",
            answers: userResponses,
        };

        try {
            const ge = "submit";
            const response = await axios.post("/api/friendlychallenge", { ge, responses });
            setChallenge(response.data);
            router.push('/home/FriendlyChallenge/Pending');
            alert("Quiz submitted successfully!");
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
            setIsQuizStarted(false); // End the quiz
        }
    };

    useEffect(() => {
        if (challenge && challenge.length && user) {
            setCanTake(canTakeQuiz());
        }
    }, [challenge, user]);

    const canTakeQuiz = () => {
        if (!challenge || !challenge.length || !user) return false;

        const currentUserId = user.id;
        const isChallenger = challenge[0]?.challengerId?.clerkId === currentUserId;
        const isChallenged = challenge[0]?.challengedId?.clerkId === currentUserId;

        const canChallengerTakeQuiz = isChallenger && challenge[0]?.challengerScore === null;
        const canChallengedTakeQuiz = isChallenged && challenge[0]?.challengedScore === null;

        return canChallengerTakeQuiz || canChallengedTakeQuiz;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div>
            <h1 className="text-3xl">Challenge ID: {challengeId}</h1>
            <div className="container mx-auto p-8">
                <h1 className="text-2xl font-bold mb-4 text-center">Challenge Details</h1>
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Challenger Email</th>
                            <th className="border border-gray-300 p-2">Opponent Email</th>
                            <th className="border border-gray-300 p-2">Topic</th>
                        </tr>
                    </thead>
                    <tbody>
                        {challenge.length > 0 ? (
                            challenge.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-300 p-2">{item.challengerId.email}</td>
                                    <td className="border border-gray-300 p-2">{item.challengedId.email}</td>
                                    <td className="border border-gray-300 p-2">{item.topic}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="border border-gray-300 p-2 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-6">
                {isQuizStarted ? (
                    <div>
                        <p className="text-xl font-bold text-green-600 text-center">Quiz in Progress</p>
                        <p className="text-lg mt-2 text-center">Time Remaining: {formatTime(timeLeft)}</p>

                        <form className="mt-6">
                            {challenge[0]?.questions?.map((question, index) => (
                                <div key={question._id} className="mb-6">
                                    <p className="font-bold">{`${index + 1}. ${question.question}`}</p>
                                    <div className="mt-2">
                                        {question.options.map((option, optIndex) => (
                                            <label
                                                key={optIndex}
                                                className="block cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${question._id}`}
                                                    value={option}
                                                    onChange={() => handleResponseChange(question._id, option)}
                                                    disabled={timeLeft === 0 || isSubmitting}
                                                />{" "}
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="px-4 py-2 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded mt-4 disabled:bg-gray-400"
                                onClick={handleSubmit}
                                disabled={isSubmitting || timeLeft === 0}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        {canTake ? (
                            <button
                                className="px-4 py-2 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded"
                                onClick={startQuiz}
                            >
                                Start Quiz
                            </button>
                        ) : (
                            <p className="text-xl font-bold text-red-600 text-center">You have already taken the quiz. Please wait for the opponent to submit the quiz.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedingChallengePage;
