// app/(main)/admin/lawyer-approval/route.ts (Revised)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const { lawyerId } = await req.json();

  // Basic validation
  if (!lawyerId) {
    return NextResponse.json({ error: 'Missing lawyer ID.' }, { status: 400 });
  }

  try {
    // 1. Check if the user exists and has a CLIENT role
    const user = await prisma.user.findUnique({ where: { id: lawyerId } });
    if (!user || user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Invalid user or user is not pending approval.' }, { status: 404 });
    }

    // 2. Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: lawyerId },
      data: { role: 'LAWYER' },
    });

    return NextResponse.json({ success: true, updatedUser });
  } catch (error) {
    console.error('Failed to approve lawyer:', error);
    return NextResponse.json({ error: 'Failed to approve lawyer.' }, { status: 500 });
  }
}
