import { connect } from '../mongodb/mongoose';
import Question from '../models/friendlychallengequestionmodel';
import FriendlyChallenge from '../models/friendlychallengemodel';

export const get10Questions = async (req,res) => {
    await connect();
    try {
            const topicNeed = req.topic;
            const count = 10;
            // console.log(topicNeed,count)
            
            
            const questions = await Question.find((topicNeed==="Miscellaneous") ? {} : {topic:topicNeed});

            const shuffled = [...questions].sort(() => 0.5 - Math.random());
            const randomQuestions = shuffled.slice(0, count);
            
            // console.log("actions" ,randomQuestions)

            return randomQuestions;
    } catch (error) {
        console.log('Error in getting 10 questions', error);
    }
};

export const AddChallenge = async (req) => {
    await connect();
    try {
        const challenge = req.challenge;
        const newChallenge = new FriendlyChallenge(challenge);
        const savedChallenge = await newChallenge.save();
        return savedChallenge;
    } catch (error) {
        console.log('Error in adding challenge', error);
    }
};

export const getPendingChallenges = async (req) => {
    await connect();
    try {
        // console.log("actions", req)

        const challengerPendingChallenges = await FriendlyChallenge.find({status:"pending" , challengerId: req.userData._id}).populate("challengedId").populate("challengerId");

        const challengedPendingChallenges = await FriendlyChallenge.find({status:"pending" , challengedId: req.userData._id}).populate("challengedId").populate("challengerId");
        
        const challenges=challengerPendingChallenges.concat(challengedPendingChallenges);

        // console.log(challenges);

        return challenges;
    } catch (error) {
        console.log('Error in adding challenge', error);
    }
};

export const getSingleChallenge = async (req) => {
    await connect();
    try {
        // console.log("actions", req) 
        const challengeId = req.challengeId;
        const challenge = await FriendlyChallenge.find({_id: challengeId}).populate("challengerId").populate("challengedId");
        return challenge;
    } catch (error) {
        console.log('Error in adding challenge', error);
    }
};