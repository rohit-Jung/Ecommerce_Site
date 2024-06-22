import { getCurrentUser } from "@/actions/getCurrentUser";
import getProducts from "@/actions/getProducts";
import { Container, ManageProductClient, NullData } from "@/components";
import React from "react";

const ManageProducts = async () => {
  const products = await getProducts({ category: null });
  const currentUser = await getCurrentUser();

  if(!currentUser) {
    return <NullData title="Oops! Access Denied" />
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageProductClient products={products}/>
      </Container>
    </div>
  );
};

export default ManageProducts;
