import { NextResponse } from "next/server";
import {saveAttendance} from "@/lib/actions/attendance"

export async function POST(request) {
    try {

        const body = await request.json();
        const res=await saveAttendance(body);
        console.log(body);
        return NextResponse.json(body);
      } catch (error) {
        console.log('Error in course api', error);
      }
}