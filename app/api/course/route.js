import { message } from "antd";
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import {Addcourse, Getcourse, Mycourse, Addstudent,Removestudent,DeletCourse} from "@/lib/actions/course"

export async function DELETE(request) {
  try {
    const url = new URL(request.url); // Create a URL object from the request URL
    const id = url.searchParams.get('id'); // Get the course ID from the query string
     // Get the user ID from the query string
    const ge=url.searchParams.get('ge');
    if(ge==="del"){
      const userid = url.searchParams.get('profid');
    const res=await DeletCourse({courseid:id,profid:userid})
    return NextResponse.json("");
    }else{
      const userid = url.searchParams.get('userid');
    const res=await Removestudent({courseid:id,userid:userid})
    return NextResponse.json("");
     }
    } catch (error) {
      console.log('Error in course api', error);
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
        }else if(ge==="join"){
          const res=await Addstudent(body);
          return NextResponse.json(res);
        }
      } catch (error) {
        console.log('Error in course api', error);
      }
}