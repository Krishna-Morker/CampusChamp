import { NextResponse } from "next/server";
import { createTimetableEntry, getTimetable, deleteTimetableEntry } from "../../../lib/actions/weeklytimetable";

export async function POST(request) {
  try {
    const body = await request.json();
    const { ge } = body;

    // Based on the 'ge' parameter, execute the corresponding function
    if (ge === "create") {
      const res = await createTimetableEntry({body});
      return NextResponse.json(res);
    } else if (ge === "get") {
      const res = await getTimetable(body);
      return NextResponse.json(res);
    } else if (ge === "delete") {
      const res = await deleteTimetableEntry({body});
      return NextResponse.json(res);
    } else {
      return NextResponse.json({ error: "Invalid action" });
    }
  } catch (error) {
    console.log("Error in timetable API", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
