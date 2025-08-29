// app/api/lawyers/match/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { caseSummary, specialization, fees, ratings } = await req.json();

    // A real-world scenario would involve a more complex algorithm,
    // e.g., a ranking system based on multiple criteria.
    const lawyers = await prisma.user.findMany({
      where: {
        role: 'LAWYER',
        specialization: specialization,
      },
      select: {
        id: true,
        name: true,
        specialization: true,
        yearsExperience: true,
        barAssociationId: true,
        ratings: true,
        fees: true,
      },
    });

    if (!lawyers || lawyers.length === 0) {
      return NextResponse.json({ message: 'No lawyers found for this specialization.' }, { status: 404 });
    }

    // You could sort the lawyers here based on ratings, fees, or other factors.
    // For this example, we'll just return the list.

    return NextResponse.json({ lawyers });
  } catch (error) {
    console.error('Error matching lawyers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
