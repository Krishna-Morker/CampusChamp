import { NextResponse } from "next/server";
import { createQuiz, fetchQuizzes, fetchQuiz, submitQuizAttempt, fetchQuizResults } from "../../../lib/actions/quiz";

export async function POST(request) {
    try {
        const body = await request.json();
        const { ge } = body;

        // Execute the corresponding function based on the 'ge' parameter
        if (ge === "create") {
            const res = await createQuiz({body});
            return NextResponse.json(res);
        } else if (ge === "fetch") {
            const { courseId } = body;
      
            if (!courseId) {
              return NextResponse.json({ error: "Missing courseId" });
            }
      
            const quizzes = await fetchQuizzes({ courseId });
            return NextResponse.json({ quizzes });
          }else if(ge ==="fetchQuiz"){
            const { quizId } = body;
            const res = await fetchQuiz({ quizId });
            return NextResponse.json(res);
          }else if(ge === "submitAttempt"){
            const res = await submitQuizAttempt({body})
            return NextResponse.json(res);
          }else if (ge === "fetchQuizResults") { // New condition
            const { quizId } = body;
            const res = await fetchQuizResults({ quizId }); // Fetch the results using the controller function
            return NextResponse.json(res);
          }
          else {
            return NextResponse.json({ error: "Invalid 'ge' parameter" });
        }
    } catch (error) {
        console.error("Error in quiz API", error);
        return NextResponse.json({ error: "An error occurred" });
    }
}