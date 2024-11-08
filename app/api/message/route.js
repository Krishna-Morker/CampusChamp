import { NextResponse } from "next/server";
import {Getmessage,Allmessage} from "@/lib/actions/message";


export async function POST(req) {

    try {
    const body = await req.json();
     const {ge}=body;
     if(ge==="message"){
      const newRoom = await Getmessage(body);
      return NextResponse.json(newRoom);
     }else if(ge==="getmessage"){
        const newRoom = await Allmessage(body);
        return NextResponse.json(newRoom);
     }
    } catch (error) {
      return NextResponse.json({ error: "Error creating room", details: error });
    }
}