"use client";

import { SafeUser } from "@/types";
import { Order, Product, Review } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import {
  FieldValue,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Heading from "../Heading";
import { Rating } from "@mui/material";
import Input from "../Inputs/Input";
import Button from "../Button";
import axios from "axios";
import toast from "react-hot-toast";

interface AddRatingProps {
  product: Product & {
    reviews: Review[];
  };
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null;
}

const AddRating: FC<AddRatingProps> = ({ product, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    //check if there is no rating
    if (data.rating === 0) {
      setIsLoading(false);
      return toast.error("No rating specified");
    }
    const ratingData = { ...data, userId: user?.id, product: product };

    //make an axios request to backend
    axios
      .post("/api/rating", ratingData)
      .then(() => {
        toast.success("Rating added successfully");
        router.refresh();
        reset();
      })
      .catch((err) => {
        toast.error("Oops! Error adding the rating");
        console.log("Error adding the rating", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!user || !product) return null;

  const deliveredOrder = user?.orders.some(
    (order) =>
      order.products.find((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered"
  );

  //Check for the existing review of the same person
  const existingReview = product?.reviews.find(
    (review: Review) => review.productId === product.id
  );

  if (existingReview || !deliveredOrder) return null;

  return (
    <>
      <div className="flex flex-col gap-2 max-w-[500px]">
        <Heading title="Rate this Product" />
        <Rating
          onChange={(event, newValue) => {
            setCustomValue("rating", newValue);
          }}
        />
        <Input
          id="comment"
          label="Comment"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Button
          label={isLoading ? "Loading.." : "Rate Product"}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default AddRating;
