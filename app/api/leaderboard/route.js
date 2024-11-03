import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/actions/user.js"

export async function GET(req,res){
    try{
        const users = await getAllUsers();
        // console.log(users)
        return NextResponse.json(users);
    }
    catch(error){
        console.log("Error in leaderboard api",error)
        return NextResponse.json("error");
    }
}