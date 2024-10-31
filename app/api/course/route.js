import { message } from "antd";
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import {Addcourse} from "@/lib/actions/course"

export async function POST(request) {
    try {
        const body = await request.json();
        const res=await Addcourse(body);
        return NextResponse.json(res);
      } catch (error) {
        console.log('Error deleting user:', error);
      }
}