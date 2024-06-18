import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
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

  return NextResponse.json(newProduct);
}
