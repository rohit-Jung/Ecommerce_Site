import { Container, ListRating, ProductDetails } from "@/app/Components";
import { products } from "@/utils/products";
import React from "react";
interface IParams {
  productId?: string;
}

const EachProduct = ({ params }: { params: IParams }) => {
  const { productId } = params;
  const product = products.find((p) => p.id === productId);
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <div>Add Rating</div>
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default EachProduct;
