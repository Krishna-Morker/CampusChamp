import { NextResponse } from "next/server";
import {Addassignment} from "@/lib/actions/assignment"
export async function POST(request) {
    try {
        const body = await request.json();
        const res=Addassignment(body)
          return NextResponse.json(res);
      } catch (error) {
        console.log('Error in course api', error);
      }
}