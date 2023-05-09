import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismaDB";
import { NextResponse } from "next/server";


interface IParams {
    conversationId?: string; 
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params; 

        const currentUser = await getCurrentUser(); 

        if(!currentUser) {
            return new NextResponse("unauthorized", {
                status: 401, 
            })
        }

        const existingConversation  = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            }, 
            include: {
                users: true,
            }
        })

        if(!existingConversation) {
            return new NextResponse("invalid Id", { status: 400})
        }

        const deletedConversations = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        }); 

        return NextResponse.json(deletedConversations); 

    }catch(error: any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE')
        return new NextResponse("internal Error", {
            status: 500,
        })
    }
}