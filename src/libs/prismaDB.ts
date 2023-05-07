import { PrismaClient } from "@prisma/client";

declare global {
    var prism: PrismaClient | undefined; 
}

const prisma = globalThis.prism || new PrismaClient(); 

if(process.env.NODE_ENV !== "production") globalThis.prism = prisma; 

export default prisma; 