import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
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

    const { name, description, price, brand, category, inStock, images } =
      await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        brand,
        category,
        inStock,
        images,
      },
    });

    if (!newProduct) {
      return NextResponse.json(
        {
          error: "Error creating product",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating product. Internal server error: ",
        error,
      },
      { status: 500 }
    );
  }
}

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

    const { id, inStock } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        inStock,
      },
    });

    if (!updatedProduct) {
      return NextResponse.json(
        {
          error: "Error updating product",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error updating product. Internal server error: ",
        error,
      },
      { status: 500 }
    );
  }
}
