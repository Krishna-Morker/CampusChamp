import {getUser} from '../../../lib/actions/user';
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const res=await getUser(body);
        return NextResponse.json(res);
      } catch (error) {
        console.log('Error deleting user:', error);
      }
}
