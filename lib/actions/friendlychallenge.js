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

export const getCompletedChallenges = async (req) => {
    await connect();
    try {
        // console.log("actions", req)

        const challengerCompletedChallenges = await FriendlyChallenge.find({status:"completed" , challengerId: req.userData._id}).populate("challengedId").populate("challengerId");

        const challengedCompletedChallenges = await FriendlyChallenge.find({status:"completed" , challengedId: req.userData._id}).populate("challengedId").populate("challengerId");
        
        const challenges=challengerCompletedChallenges.concat(challengedCompletedChallenges);

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

export const submitChallenge = async ({ ge, responses }) => {
    try {
      // Ensure the operation type is correct
      if (ge !== "submit") {
        throw new Error("Invalid operation type");
      }
  
      const { challengeId, userType, answers } = responses;
  
      // Fetch the challenge document
      const challenge = await FriendlyChallenge.findById(challengeId);
  
      if (!challenge) {
        throw new Error("Challenge not found");
      }
  
      // Validate userType
      if (userType !== "challenger" && userType !== "challenged") {
        throw new Error("Invalid user type");
      }
  
      // Initialize responses array if not already present
      if (userType === "challenger" && !challenge.challengerResponses) {
        challenge.challengerResponses = Array(challenge.questions.length).fill(null);
      } else if (userType === "challenged" && !challenge.challengedResponses) {
        challenge.challengedResponses = Array(challenge.questions.length).fill(null);
      }
  
      // Update responses
      Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
        const questionIndex = challenge.questions.findIndex((q) => q._id.toString() === questionId);
  
        if (questionIndex === -1) {
          throw new Error(`Question ID ${questionId} not found in the challenge.`);
        }
  
        const selectedOptionIndex = challenge.questions[questionIndex].options.indexOf(selectedAnswer);
  
        if (selectedOptionIndex === -1) {
          throw new Error(`Selected answer "${selectedAnswer}" is not a valid option for question ID ${questionId}.`);
        }
  
        if (userType === "challenger") {
          challenge.challengerResponses[questionIndex] = selectedOptionIndex;
        } else if (userType === "challenged") {
          challenge.challengedResponses[questionIndex] = selectedOptionIndex;
        }
      });
  
      // Calculate the score for the user
      let score = 0;
      const responsesArray = userType === "challenger" ? challenge.challengerResponses : challenge.challengedResponses;
  
      responsesArray.forEach((response, index) => {
        if (response !== null && challenge.questions[index].correctAnswer === response) {
          score++;
        }
      });
  
      // Update the score for the appropriate user
      if (userType === "challenger") {
        challenge.challengerScore = score;
      } else if (userType === "challenged") {
        challenge.challengedScore = score;
      }
  
      // Check if both scores are set, then update status to 'completed'
      if (challenge.challengerScore !== null && challenge.challengedScore !== null) {
        challenge.status = "completed";
      }
  
      // Save the updated challenge
      const updatedChallenge = await challenge.save();
  
      return updatedChallenge;
    } catch (error) {
      console.error("Error in submitChallenge:", error);
      throw error;
    }
  };
  