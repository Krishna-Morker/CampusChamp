import { NextResponse } from "next/server";
import {Addassignment,getAssigment} from "@/lib/actions/assignment"

export async function POST(request) {
    try {
        const body = await request.json();

        const {ge}=body;
       // console.log(body,"fcwefewF")
        if(ge=="add"){
            const res=getAssigment(body)
            console.log(res);
            return NextResponse.json(res);
        }else if(ge==="addass"){
        const res=Addassignment(body)
        return NextResponse.json(res);
        }
         
      } catch (error) {
        console.log('Error in course api', error);
      }
}