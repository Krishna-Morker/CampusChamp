import { NextResponse } from "next/server";
import {addTask,remTask} from '../../../lib/actions/task';

export async function POST(request) {
    try {
        const body = await request.json();
        const {ge}=body;
       // console.log(ge,"kl");
        if(ge==="addtask"){
        const res=await addTask(body);
        return NextResponse.json(res);
        }else if(ge==="remtask"){
            const res=await remTask(body);
            return NextResponse.json(res);  
        }
      } catch (error) {
        console.log('Error deleting user:', error);
      }
}
