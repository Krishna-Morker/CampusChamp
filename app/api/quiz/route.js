import { NextResponse } from "next/server";
import { createQuiz, fetchQuizzes } from "../../../lib/actions/quiz";

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
          }else {
            return NextResponse.json({ error: "Invalid 'ge' parameter" });
        }
    } catch (error) {
        console.error("Error in quiz API", error);
        return NextResponse.json({ error: "An error occurred" });
    }
}