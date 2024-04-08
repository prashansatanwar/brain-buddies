import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../prismaClient'
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const users = await prisma.user.findMany();
    return NextResponse.json({"users":users});
}