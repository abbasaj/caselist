// app/api/admin/analytics/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getSession();

  // Protect this route, only allow admins to access
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 403 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalLawyers = await prisma.user.count({ where: { role: 'LAWYER' } });
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });
    const totalCases = await prisma.case.count();
    const activeCases = await prisma.case.count({ where: { status: 'IN_PROGRESS' } });
    const completedCases = await prisma.case.count({ where: { status: 'CLOSED' } });
    
    // Calculate total revenue from released payments
    const totalRevenueResult = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'RELEASED',
      },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    return NextResponse.json({
      totalUsers,
      totalLawyers,
      totalClients,
      totalCases,
      activeCases,
      completedCases,
      totalRevenue,
    });
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
