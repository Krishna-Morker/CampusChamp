import { NextResponse } from "next/server"; 
import { getActivity, createActivity, deleteActivity,getAllUserActivities } from "../../../lib/actions/activity";

export async function POST(request) {
    try {
        const body = await request.json();
        const { ge } = body;

        // Based on the 'ge' parameter, execute the corresponding function
        if (ge === "read") {
            const res = await getActivity(body);
            return NextResponse.json(res);
        }
        else if(ge==="get_all"){
            const res = await getAllUserActivities(body);
            return NextResponse.json(res);
        }
         else if (ge === "create") {
            const res = await createActivity({body});
            return NextResponse.json(res);
        } else if (ge === "delete") {
            const res = await deleteActivity({body});
            return NextResponse.json(res);
        }
        
    } catch (error) {
        console.log("Error in activities API", error);
        return NextResponse.json({ error: "An error occurred" });
    }
}
