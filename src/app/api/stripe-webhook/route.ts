import { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "node:buffer";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { Address } from "@prisma/client";

export const config = {
  runtime: "edge",
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request, res: Response) {
  // console.log("this is", Object.assign(req.headers).get("stripe-signature") as string)
  const buff = await req.text();
  const sign = Object.assign(req.headers).get("stripe-signature") as string;

  if (!sign) {
    return NextResponse.json(
      {
        message: "Missing Stripe signature",
      },
      {
        status: 400,
      }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buff,
      sign,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log("Error occurred in stripe webhook construct", error);
    return NextResponse.json(
      {
        error: "Error occurred in stripe webhook construct",
      },
      {
        status: 400,
      }
    );
  }

  switch (event.type) {
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;
      console.log("address", charge.shipping?.address);
      if (typeof charge.payment_intent === "string") {
        await prisma?.order.update({
          where: { paymentIntentId: charge.payment_intent },
          data: {
            status: "complete",
            address: charge.shipping?.address as Address,
          },
        });
      }
      break;

    default:
      console.log("Unhandled event type", event.type);
      break;
  }

  return NextResponse.json(
    {
      message: "Successfully Received !",
    },
    {
      status: 200,
    }
  );
}
