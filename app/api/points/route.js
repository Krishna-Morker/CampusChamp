import {incPoints,Points,ChallengePoints} from '@/lib/actions/points';
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const {ge}=body;
        if(ge==="add"){
        const res=await Points(body);
        return NextResponse.json(res);
        }else if(ge==="addextra"){
        const res=await incPoints(body);
        return NextResponse.json(res);
        }else if(ge==="addchall"){
          const res=await ChallengePoints(body);
          return NextResponse.json(res);
          }
      } catch (error) {
        console.log('Error deleting user:', error);
      }
}
