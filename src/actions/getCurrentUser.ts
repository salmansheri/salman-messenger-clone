import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../libs/prismaDB";
import { User } from "@prisma/client";

const getCurrentUser = async () => {
    try {
        const session = await getServerSession(authOptions);

    if(!session?.user?.email) {
        return null; 
    }

    const currentUser: User | null = await prisma.user.findUnique({
        where: {
            email: session?.user?.email,
        }
    }); 

    if(!currentUser) {
        return null; 
    }

    return currentUser;

    } catch(error) {
        console.log(error)
    }
    
    
}

export default getCurrentUser; 
 