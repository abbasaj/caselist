// app/api/zoom/schedule/route.ts

import { NextResponse } from 'next/server';
import { createZoomMeeting } from '@/lib/zoom';

export async function POST(req: Request) {
  try {
    const { topic, duration } = await req.json();

    if (!topic || !duration) {
      return NextResponse.json({ error: 'Topic and duration are required.' }, { status: 400 });
    }

    const meetingData = await createZoomMeeting(topic, duration);

    // In a real application, you would save the meeting data (e.g., meeting_id, join_url)
    // to your database, associating it with the case.

    return NextResponse.json({
      success: true,
      joinUrl: meetingData.join_url,
      startUrl: meetingData.start_url, // for the host (lawyer)
    });
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
