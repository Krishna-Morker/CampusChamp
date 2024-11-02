import { NextResponse } from "next/server";
import {saveAttendance,saveStatus} from "@/lib/actions/attendance"

export async function POST(request) {
    try {
        const body = await request.json();
        const {ge}=body;
       
        if(ge==="submitattendance"){
        const res=await saveAttendance(body);
        return NextResponse.json(res);
        }else if(ge==="attstatus"){
            const res=await saveStatus(body);
            return NextResponse.json(res);
        }
      } catch (error) {
        console.log('Error in course api', error);
      }
}