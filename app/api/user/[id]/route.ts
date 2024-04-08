import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../prismaClient'
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: {id: String(id)}
    })
    return NextResponse.json({"user":user}, {status:200});
}

export async function PATCH(req: Request, { params: { id } }: { params: { id: string } }) {
    const updates = await req.json();

    console.log("UPDATES",updates);

    await prisma.user.update({
        where : {id: String(id)},
        data: updates
    });

    return NextResponse.json({message: "Updated"}, {status: 200});
}