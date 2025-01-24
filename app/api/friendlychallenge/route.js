import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/actions/user.js"
import { get10Questions } from "@/lib/actions/friendlychallenge.js"
import { AddChallenge , getPendingChallenges } from "@/lib/actions/friendlychallenge.js"

export async function GET(){
    try{
        const users = await getAllUsers();
        // console.log(users)
        return NextResponse.json(users);
    }
    catch(error){
        console.log("Error in friendlychallenge api",error)
        return NextResponse.json("error");
    }
}

export async function POST(req){
    try{
        const body = await req.json();
        const {ge}=body;
        if(ge==="getQuestions"){
            const questions = await get10Questions(body);
            return NextResponse.json(questions);
        }
        else if(ge==="add"){
            const res=await AddChallenge(body);
            return NextResponse.json(res);
        }
        else if(ge==="pending"){
            // console.log("route",body);
            const res=await getPendingChallenges(body);
            return NextResponse.json(res);
        }
    }
    catch(error){
        console.log("Error in friendlychallenge api",error)
        return NextResponse.json("error");
    }
}