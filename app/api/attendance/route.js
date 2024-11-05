import { NextResponse } from "next/server";
import {saveAttendance,saveStatus,getAttendance} from "@/lib/actions/attendance"

export async function POST(request) {
    try {
        const body = await request.json();
        // console.log(body)
        const {ge}=body;
       
        if(ge==="submitattendance"){
        const res=await saveAttendance(body);
        return NextResponse.json(res);
        }else if(ge==="attstatus"){
            const res=await saveStatus(body);
            return NextResponse.json(res);
        }
        else if(ge==='viewattendance'){
          const res=await getAttendance(body);
          return NextResponse.json(res);
        }
      } catch (error) {
        console.log('Error in course api', error);
      }
}