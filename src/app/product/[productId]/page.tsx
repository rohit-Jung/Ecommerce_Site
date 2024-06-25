import { getCurrentUser } from "@/actions/getCurrentUser";
import getProductById from "@/actions/getProductById";
import {
  AddRating,
  Container,
  ListRating,
  NullData,
  ProductDetails,
} from "@/components";
import { products } from "@/utils/products";
import React from "react";
interface IParams {
  productId?: string;
}

const EachProduct = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);
  const user = await getCurrentUser();

  if (!product) return <NullData title="No Product Data" />;

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} user={user} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default EachProduct;
