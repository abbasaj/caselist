// app/api/zoom/create-meeting/route.ts

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// In a real app, this would be retrieved securely, e.g., from a database for each user.
const API_KEY = process.env.ZOOM_API_KEY;
const API_SECRET = process.env.ZOOM_API_SECRET;

export async function POST(req: Request) {
  try {
    const { topic, start_time, duration, password } = await req.json();

    if (!API_KEY || !API_SECRET) {
      return NextResponse.json({ error: 'Zoom API credentials not configured.' }, { status: 500 });
    }

    // JWT for server-side API calls
    const payload = {
      iss: API_KEY,
      exp: new Date().getTime() + 5000,
    };
    const token = jwt.sign(payload, API_SECRET);

    // Call the Zoom API to create a meeting
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: topic,
        type: 2, // Scheduled meeting
        start_time: start_time,
        duration: duration,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // You would save the meeting details (e.g., join_url) to your database here.
      return NextResponse.json({ success: true, joinUrl: data.join_url });
    } else {
      return NextResponse.json({ error: data.message || 'Failed to create meeting.' }, { status: response.status });
    }

  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
