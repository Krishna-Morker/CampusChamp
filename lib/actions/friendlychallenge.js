import { connect } from '../mongodb/mongoose';
import Question from '../models/friendlychallengequestionmodel';

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