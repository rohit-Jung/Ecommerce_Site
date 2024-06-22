import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    console.log("params id", params);

    const { productId } = params;
    console.log("Product id", productId);
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
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error deleting product. Internal server error: ",
        error,
      },
      { status: 500 }
    );
  }
}
