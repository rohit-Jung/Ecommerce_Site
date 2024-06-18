import React from "react";
import { CartClient, Container } from "../Components";
import { getCurrentUser } from "@/actions/getCurrentUser";

const CartPage = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div className="pt-8">
      <Container>
        <CartClient currentUser={currentUser} />
      </Container>
    </div>
  );
};

export default CartPage;
