import React from "react";
import Image from "next/image";
import { truncateText } from "@/utils/truncateText";
import { Rating } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";

interface ProductCardProps {
  data: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const productRating =
    data.reviews.reduce((acc: number, item: any) => acc + item.rating, 0) /
    data.reviews.length;
  return (
    <Link href={`product/${data.id}`}>
      <div className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 rounded-sm p-2 transition hover:scale-105 text-center text-sm">
        <div className="flex flex-col items-center w-full gap-1">
          <div className="aspect-square overflow-hidden relative w-full">
            <Image
              src={data.images[0].image}
              alt={data.name}
              fill
              className="w-full h-full object-contain"
            />
          </div>
          <div>{truncateText(data.name)}</div>
          <div>
            <Rating value={productRating} readOnly />
          </div>
          <div>{data.reviews.length} reviews</div>
          <div className="font-semibold">{formatPrice(data.price)}</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
