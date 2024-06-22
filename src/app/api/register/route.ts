import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
  
    if (!user) {
      return NextResponse.json({
        status: 400,
        message: "Something went wrong",
      });
    }
  
    return NextResponse.json({
      status: 200,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating user. Internal server error: ",
        error,
      },
      { status: 500 }
    );
  }
  }
}
