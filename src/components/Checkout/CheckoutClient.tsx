"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Button from "../Button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);


  const router = useRouter();

  useEffect(() => {
    //create payment intent as soon as page loads
    if (cartProducts) {
      setIsLoading(true);
      setIsError(false);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((result) => {
          setIsLoading(false);
          if (result.status === 401) {
            return router.push("/login");
          }

          return result.json();
        })
        .then((data) => {
          // console.log("cart Intent", data);

          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        })
        .catch((err) => {
          setIsError(true);
          console.log("Error in stripe client", err);
          toast.error("Something went wrong");
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartProducts, paymentIntent]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setIsPaymentSuccess(value);
  }, []);
  return (
    <div>
      {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}
      {isLoading && <div className="text-center">Loading Checkout...</div>}
      {isError && (
        <div className="text-center text-rose-500">
          Something went wrong....
        </div>
      )}
      {isPaymentSuccess && (
        <div>
          <div className="text-teal-500 text-center mb-2 font-bold text-xl">
            Payment success
          </div>
          <div className="w-full max-w-[220px]">
            <Button
              label="View Your Orders"
              onClick={() => router.push("/orders")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
