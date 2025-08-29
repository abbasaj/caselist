// app/api/profile/update/route.ts

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod'; // For validation

// Define a Zod schema for validation
const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50),
  specialization: z.string().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  bio: z.string().min(10).optional(),
  // Add other fields as needed
});

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = profileUpdateSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Profile update failed:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
