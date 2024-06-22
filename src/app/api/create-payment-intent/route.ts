import Stripe from "stripe";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { CartProductType } from "../../../components/Products/ProductDetails";
import { getCurrentUser } from "@/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

// console.log("Stripe Secret", process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;

    return acc + itemTotal;
  }, 0);

  const price = Math.floor(totalPrice * 100);
  return price;
};

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
  
    const { items, payment, payment_intent_id } = await req.json();
  
    const totalPrice = calculateOrderAmount(items);
  
    const orderData = {
      user: { connect: { id: currentUser.id } },
      amount: totalPrice,
      currency: "usd",
      status: "pending",
      deliveryStatus: "pending",
      paymentIntentId: payment_intent_id,
      products: items,
    };
  
    if (payment_intent_id) {
      const currrentIntent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );
  
      if (currrentIntent) {
        const updatedIntent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: totalPrice,
          }
        );
  
        //update the order
        const [existing_order, update_order] = await Promise.all([
          prisma.order.findFirst({
            where: {
              paymentIntentId: payment_intent_id,
            },
          }),
          prisma.order.update({
            where: {
              paymentIntentId: payment_intent_id,
            },
            data: {
              amount: totalPrice,
              products: items,
            },
          }),
        ]);
  
        if (!existing_order) {
          return NextResponse.json(
            { error: "Invalid Payment intent" },
            { status: 400 }
          );
        }
  
        return NextResponse.json({
          paymentIntent: updatedIntent,
        });
      }
    } else {
      //create the payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });
      //create order
      orderData.paymentIntentId = paymentIntent.id;
  
      await prisma.order.create({
        data: orderData,
      });
  
      return NextResponse.json({
        paymentIntent,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error in creating payment. Internal server error: ",
        error,
      },
      { status: 500 }
    );
  }
  }
}
