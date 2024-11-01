import { message } from "antd";
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import {Addcourse, Getcourse, Mycourse} from "@/lib/actions/course"

export async function GET(request) {
  try {
    console.log("svsrvrr")
    const body =  request.query;
    console.log(body,"get");
    } catch (error) {
      console.log('Error deleting user:', error);
    }
}

export async function POST(request) {
    try {

        const body = await request.json();
        const {ge}=body;
       
        if(ge==="add"){
        const res=await Addcourse(body);
        return NextResponse.json(res);
        }else if(ge==="get"){
        //  console.log(body,"get");
          const res=await Getcourse(body.id);
          return NextResponse.json(res);
        }else if(ge==="mycou"){
          const res=await Mycourse(body.id);
          return NextResponse.json(res);
        }
      } catch (error) {
        console.log('Error deleting user:', error);
      }
}