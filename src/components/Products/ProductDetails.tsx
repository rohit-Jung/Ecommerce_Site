"use client";
import { Rating } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SetColor from "./SetColor";
import SetQuantity from "./SetQuantity";
import Button from "../Button";
import ProductImage from "./ProductImage";
import { useCart } from "@/hooks/useCart";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  product: any;
}

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImgType;
  quantity: number;
  price: number;
};

export type SelectedImgType = {
  color: string;
  colorCode: string;
  image: string;
};

const HorizontalLine = () => {
  return <hr className="w-[60%] my-2" />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { handleAddProductToCart, cartProducts } = useCart();
  const [isProductInCart, setIsProductInCart] = useState(false);

  const router = useRouter();

  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1,
    price: product.price,
  });

  // console.log(cartProducts);

  useEffect(() => {
    setIsProductInCart(false);

    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartProducts]);

  const productRating =
    product.reviews.reduce((acc: number, item: any) => acc + item.rating, 0) /
    product.reviews.length;

  const handleColorSelect = useCallback(
    (value: SelectedImgType) => {
      setCartProduct((prev) => ({ ...prev, selectedImg: value }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartProduct.selectedImg]
  );

  //   console.log(cartProduct);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity == 1) return;
    setCartProduct((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
  }, [cartProduct.quantity]);

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity == 99) return;
    setCartProduct((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  }, [cartProduct.quantity]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <HorizontalLine />
        <div className="text-justify">{product.description}</div>
        <HorizontalLine />
        <div>
          <span className="font-semibold ">CATEGORY: </span>
          {product.category}
        </div>
        <div>
          <span className="font-semibold ">BRAND: </span>
          {product.brand}
        </div>
        <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </div>
        <HorizontalLine />
        {isProductInCart ? (
          <>
            <p className="text-slate-500 flex mb-2 items-center gap-2">
              <MdCheckCircle className="text-teal-400" />
              <span>Product added to cart</span>
            </p>
            <div className="max-w-[300px]">
              <Button
                label="Go to Cart"
                outline
                onClick={() => router.push("/cart")}
              />
            </div>
          </>
        ) : (
          <>
            <SetColor
              images={product.images}
              cartProduct={cartProduct}
              handleColorSelect={handleColorSelect}
            />
            <HorizontalLine />
            <SetQuantity
              cartProduct={cartProduct}
              cartCounter={true}
              handleQtyDecrease={handleQtyDecrease}
              handleQtyIncrease={handleQtyIncrease}
            />
            <HorizontalLine />
            <div className="max-w-[300px]">
              <Button
                label="Add to Cart"
                onClick={() => handleAddProductToCart(cartProduct)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
