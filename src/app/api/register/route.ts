import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/libs/prismaDB";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json("Missing info", {
        status: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.log(error, "REGISTRATION ERROR");
    return NextResponse.error();
  }
}
