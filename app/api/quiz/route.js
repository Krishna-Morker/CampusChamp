import { NextResponse } from "next/server";
import { createQuiz } from "../../../lib/actions/quiz";

export async function POST(request) {
    try {
        const body = await request.json();
        const { ge } = body;

        // Execute the corresponding function based on the 'ge' parameter
        if (ge === "create") {
            const res = await createQuiz({body});
            return NextResponse.json(res);
        } else {
            return NextResponse.json({ error: "Invalid 'ge' parameter" });
        }
    } catch (error) {
        console.error("Error in quiz API", error);
        return NextResponse.json({ error: "An error occurred" });
    }
}