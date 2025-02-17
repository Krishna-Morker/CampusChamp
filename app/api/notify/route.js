import pusher from '../../../lib/actions/pusherConfig'
import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { message, userId } = body;

      console.log('Sending notification:', message, userId);

      // Trigger the event to Pusher (make sure the channel and event match your client-side code)
      await pusher.trigger('user-channel', 'new-notification', {
        message,
        userId, // You can add userId to target specific users
      });

      // Return a success response
      return NextResponse.json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
      console.error('Error sending notification:', error);
      return NextResponse.json({ error: 'Failed to send notification' });
    }
  } else {
    // Handle the case for unsupported methods (i.e., if it's not a POST)
    return NextResponse.json({ error: 'Method Not Allowed' });
  }
}
