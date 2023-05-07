import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getSession() {
    try {
        const session = await getServerSession(authOptions);
        
        return session; 


    } catch(error) {
        return null; 
    }
}

export default getSession; 