import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PUT(req: Request, res: Response) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
        },
        {
          status: 401,
        }
      );
    }

    const { id, deliveryStatus } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        deliveryStatus,
      },
    });

    if (!updatedOrder) {
      return NextResponse.json(
        {
          error: "Error updating order",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error updating order. Internal server error: ",
        error,
      },
      { status: 500 }
    );
  }
}
