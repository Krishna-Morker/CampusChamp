import { NextResponse } from "next/server";
import {Addassignment,getAssigment,Addstudent,delStudent,Absentass} from "@/lib/actions/assignment"

export async function POST(request) {
    try {
        const body = await request.json();
        const {ge}=body;
       // console.log(body,"fcwefewF")
        if(ge==="add"){
            const res=await getAssigment(body);
            return NextResponse.json(res);
        }else if(ge==="addass"){
        const res=await Addassignment(body)
        return NextResponse.json(res);
        }else if(ge==="addstu"){
          const {newFile}=body;
          const res=await Addstudent(newFile)
          return NextResponse.json(res);
        }else if(ge==="del"){
          const res=await Addstudent(body)
          return NextResponse.json(res);
        }else if(ge==="removestu"){
          const res=await delStudent(body)
          return NextResponse.json(res);
        }else if(ge==="absent"){
          const res=await Absentass(body)
          return NextResponse.json(res);
        }
      } catch (error) {
        console.log('Error in course api', error);
      }
}