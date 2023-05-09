import { NextResponse } from "next/server";
import prisma from "@/libs/prismaDB";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request:Request) {
    try {
        const currentUser = await getCurrentUser(); 

        const body = await request.json();

        const { 
            image,
            name

        } = body; 

        if(!currentUser?.id) {
            return new NextResponse("Unauthorized", { 
                status: 401
            })
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser?.id
            }, 
            data: {
                image,
                name,
            }
        }); 

        return NextResponse.json(updatedUser);

    } catch(error: any) {
        console.log(error, 'ERROR_SETTINGS')
        return new NextResponse("internal error", {
            status: 500
        })
    }

}