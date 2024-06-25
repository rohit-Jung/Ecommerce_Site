import { getCurrentUser } from "@/actions/getCurrentUser";
import { Review } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
        },
        {
          status: 401,
        }
      );
    }

    const { comment, rating, product, userId } = await req.json();

    const deliveredOrder = currentUser?.orders.some(
      (order) =>
        order.products.find((item) => item.id === product.id) &&
        order.deliveryStatus === "delivered"
    );

    if (!deliveredOrder) {
      return NextResponse.json(
        {
          error: "Order not delivered. Cannot review the product.",
        },
        { status: 400 }
      );
    }
    
    //Check for the existing review of the same person
    const existingReview = product?.reviews.find(
      (review: Review) => review.productId === product.id
    );

    if (existingReview) {
      return NextResponse.json(
        {
          error: "You have already reviewed this product",
        },
        {
          status: 400,
        }
      );
    }

    const review = await prisma?.review.create({
        data: {
            comment,
            rating,
            productId: product.id,
            userId,
        }
    })

    if(!review) {
        return NextResponse.json(
            {
                error: "Error in creating review",
            },
            {
                status: 500,
            }
        )
    }

    return NextResponse.json(review);
  } catch (error) {}
}
