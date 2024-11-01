import { message } from "antd";
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import {Addcourse, Getcourse} from "@/lib/actions/course"



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
        }
      } catch (error) {
        console.log('Error deleting user:', error);
      }
}