"use client";
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { use , useState , useEffect } from 'react'


const PedingChallengePage = ({ params }) => {
    const { id } = use(params);
    const [challengeId, setChallengeId] = useState(null);
    const [challenge, setChallenge] = useState(null);
    const { user } = useUser();
    const [dbUser, setDbUser] = useState(null);

    useEffect(() => {
        if (challengeId) {
            const fetchChallenge = async () => {
                try {
                    const ge = "getSingle";
                    const response = await axios.post('/api/friendlychallenge' , { ge , challengeId });
                    console.log(response.data);
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
                    const response = await axios.post('/api/user', { id:user.id });
                    setDbUser(response.data);
                } catch (error) {
                    console.log("Error fetching user:", error);
                }
            };
            fetchUser();
        }
    }, [user]);

    return (
        <div>
            <h1 className='text-3xl'>Challenge ID: {challengeId}</h1>

        </div>
    )
}

export default PedingChallengePage;