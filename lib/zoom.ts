// lib/zoom.ts
import jwt from 'jsonwebtoken';

const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

export function generateZoomJwt() {
  if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
    throw new Error('Zoom API credentials are not configured.');
  }

  const payload = {
    iss: ZOOM_API_KEY,
    exp: new Date().getTime() + 5000,
  };

  const token = jwt.sign(payload, ZOOM_API_SECRET, {
    algorithm: 'HS256',
  });

  return token;
}

export async function createZoomMeeting(topic: string, duration: number) {
  const token = generateZoomJwt();
  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topic: topic,
      type: 2, // Scheduled meeting
      duration: duration,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create Zoom meeting.');
  }
  return data;
}
