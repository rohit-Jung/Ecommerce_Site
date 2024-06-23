import { getCurrentUser } from "@/actions/getCurrentUser";
import getOrders from "@/actions/getOrders";
import { Container, ManageOrderClient, NullData } from "@/components";
import React from "react";

const ManageOrders = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! Access Denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageOrderClient orders={orders} />
      </Container>
    </div>
  );
};

export default ManageOrders;
