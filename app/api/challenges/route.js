import { NextResponse } from "next/server";
import {Addchallenge,getChallenges,Addstudent,delStudent,presentChallenges,remChal,remChallenges} from "../../../lib/actions/challenges"

export async function POST(request) {
    try {
        const body = await request.json();
        const {ge}=body;
       // console.log(body,"fcwefewF")
        if(ge==="add"){
            const res=await getChallenges(body);
            return NextResponse.json(res);
        }else if(ge==="addass"){
        const res=await Addchallenge(body)
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
        }else if(ge==="present"){
          const res=await presentChallenges(body)
          return NextResponse.json(res);
        }else if(ge==="remove-assignment"){
          const res=await remChal(body)
          return NextResponse.json(res);
        }else if(ge==="remass"){
          const res=await remChallenges(body)
          return NextResponse.json(res);
        }
      } catch (error) {
        console.log('Error in course api', error);
      }
}