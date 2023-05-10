import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismaDB";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string; 
}

export async function POST(
    request: Request,
    {params}: {params: IParams}
) {
    const { conversationId } = params; 

    try {
        const currentUser = await getCurrentUser(); 

        if(!currentUser?.id  || !currentUser?.email) {
            return new NextResponse('unAuthorized', {
                status: 401,
            })
        }

        // finding the existing conversation
        const conversation  = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            }, 
            include: {
                messages: {
                    include: {
                        seen: true,

                    }
                }, 
                users: true,
            }
        }); 

        if(!conversation) {
            return new NextResponse("invalid Id", {
                status: 400,
            })
        }

        // find the last message 

        const lastMessage = conversation.messages[conversation.messages.length - 1]

        if(!lastMessage) {
            return NextResponse.json(conversation)
        }

        // update the seen of  last message ;

        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            }, 
            include: {
                sender: true,
                seen: true,
            }, 
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        }); 

        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        }); 

        if(lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation)
        }

        await pusherServer.trigger(conversationId!, 'messages:update', updatedMessage)

        return NextResponse.json(updatedMessage); 


    } catch(error:any){
        console.log(error, "ERROR_MESSAGES_SEEN")
        return new NextResponse("internal error", {
            status: 500
        })
    }

}
