import { NextResponse } from "next/server";
import {createroom,Pendingrequest,Acceptrequest,Deleterequest} from "@/lib/actions/study-room";


export async function POST(req) {

    try {
    const body = await req.json();
     const {ge}=body;
     if(ge==="createroom"){
        const {roomData}=body;
      const newRoom = await createroom(roomData);
      return NextResponse.json(newRoom);
     }else if(ge==="request"){
     const newRoom = await Pendingrequest(body);
      return NextResponse.json(newRoom);  
     }else if(ge==="accept"){
        const newRoom = await Acceptrequest(body);
        return NextResponse.json("Sucessfully accepted request");  
     }else if(ge==="reject"){
        const newRoom = await Deleterequest(body);
        return NextResponse.json("Sucessfully rejected request");  
     }
    } catch (error) {
      return NextResponse.json({ error: "Error creating room", details: error });
    }
}
