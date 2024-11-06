import { NextResponse } from "next/server";
import { getNotifi,markAllNotifications } from "@/lib/actions/notification";


export async function POST(req){
    try{

        const body=await req.json();
        const {ge}=body;
        console.log(body,"body")
        if(ge==="getnotification"){
        const noti=await getNotifi(body);
        return NextResponse.json(noti);
        }else if(ge==="markAsRead"){
        const noti=await markAllNotifications(body);
        return NextResponse.json(noti);
        }
    }
    catch(error){
        console.log("Error in leaderboard api",error)
        return NextResponse.json("error");
    }
}