"use client";
import React , { use , useState , useEffect } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

export default function CompletedChallengePage({params}) {
    const { id } = use(params);
    const router = useRouter();
    const [challengeId, setChallengeId] = useState(null);
    const [challenge, setChallenge] = useState(null);
    const { user } = useUser();
    const [dbUser, setDbUser] = useState(null);

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

    // Fetch challenge details
    useEffect(() => {
        if (challengeId) {
            const fetchChallenge = async () => {
                try {
                    const ge = "getSingle";
                    const response = await axios.post('/api/friendlychallenge', { ge, challengeId });
                    // console.log(response.data[0]);
                    setChallenge(response.data[0]);
                } catch (error) {
                    console.log("Error fetching challenge:", error);
                }
            };
            fetchChallenge();
        }
    }, [challengeId]);

  return (
    <div>
        
        {challenge ? (
        <div className="p-4">
            {/* Quiz Information */}
            <h2 className="text-lg font-bold mb-4">Quiz Topic: {challenge.topic}</h2>
            <p className="mb-4">
            <strong>Challenger:</strong> {challenge.challengerId.email} <br />
            <strong>Challenged:</strong> {challenge.challengedId.email}
            </p>

            {/* Questions Table */}
            <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
            <thead>
                <tr>
                <th className="border border-gray-300 p-2">Question</th>
                <th className="border border-gray-300 p-2">Options</th>
                <th className="border border-gray-300 p-2">Correct Answer</th>
                <th className="border border-gray-300 p-2">Challenger's Response</th>
                <th className="border border-gray-300 p-2">Challenged's Response</th>
                </tr>
            </thead>
            <tbody>
                {challenge.questions.map((question, index) => (
                <tr key={question._id}>
                    {/* Question */}
                    <td className="border border-gray-300 p-2">{question.question}</td>

                    {/* Options */}
                    <td className="border border-gray-300 p-2">
                    <ul className="list-disc list-inside">
                        {question.options.map((option, optIndex) => (
                        <li key={optIndex}>
                            {optIndex + 1}. {option}
                        </li>
                        ))}
                    </ul>
                    </td>

                    {/* Correct Answer */}
                    <td className="border border-gray-300 p-2">
                    {question.options[question.correctAnswer]}
                    </td>

                    {/* Challenger's Response */}
                    <td
                    className={`border border-gray-300 p-2 ${
                        challenge.challengerResponses[index] === null
                        ? "text-gray-500 italic"
                        : ""
                    }`}
                    >
                    {challenge.challengerResponses[index] === null
                        ? "Unattempted"
                        : question.options[challenge.challengerResponses[index]]}
                    </td>

                    {/* Challenged's Response */}
                    <td
                    className={`border border-gray-300 p-2 ${
                        challenge.challengedResponses[index] === null
                        ? "text-gray-500 italic"
                        : ""
                    }`}
                    >
                    {challenge.challengedResponses[index] === null
                        ? "Unattempted"
                        : question.options[challenge.challengedResponses[index]]}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            {/* Scores Section */}
            <div className="flex justify-around mt-6">
            <p
                className={`font-bold text-lg ${
                dbUser.email === challenge.challengerId.email
                    ? "text-green-600"
                    : "text-red-600"
                }`}
            >
                Challenger({challenge.challengerId.email}) Score: {challenge.challengerScore}
            </p>
            <p
                className={`font-bold text-lg ${
                dbUser.email === challenge.challengedId.email
                    ? "text-green-600"
                    : "text-red-600"
                }`}
            >
                Challenged({challenge.challengedId.email}) Score: {challenge.challengedScore}
            </p>
            </div>
            
            
            {/* Winner Section */}
            <div className="mt-6 text-center">
            {challenge.challengerScore > challenge.challengedScore ? (
                <p
                className={`text-lg font-bold ${
                    dbUser.email === challenge.challengerId.email
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                Winner: {challenge.challengerId.email} (Challenger)
                </p>
            ) : challenge.challengerScore < challenge.challengedScore ? (
                <p
                className={`text-lg font-bold ${
                    dbUser.email === challenge.challengedId.email
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                Winner: {challenge.challengedId.email} (Challenged)
                </p>
            ) : (
                <p className="text-yellow-600 text-lg font-bold">It's a Tie!</p>
            )}
            </div>
        </div>
        ) : (
        <p>No challenge data available.</p>
        )}

    </div>
  )
}
