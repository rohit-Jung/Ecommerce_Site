import React from "react";
import { CheckoutClient, Container, FormWrap } from "../Components";

const Checkout = () => {
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <CheckoutClient />
        </FormWrap>
      </Container>
    </div>
  );
};

export default Checkout;
