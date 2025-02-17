import { NextResponse } from "next/server";
import {setTimer,getTimer} from "../../../lib/actions/study-room";


export async function POST(req) {
  try {
    const body = await req.json();
    const { ge } = body;

    //console.log(ge, "kl"); // Check if `ge` is being passed correctly

    if (ge === "timer") {
      const newRoom = await setTimer(body); // Set the timer
      return NextResponse.json(newRoom);
    } else if (ge === "gettimer") {
      const timerData = await getTimer(body); // Fetch the timer data
      //console.log(timerData, "api"); // Ensure `getTimer` is returning data
      return NextResponse.json(timerData);
    } else {
      return NextResponse.json({ error: "Invalid ge value" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error processing request", details: error });
  }
}

