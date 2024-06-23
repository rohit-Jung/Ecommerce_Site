import getOrderById from "@/actions/getOrderById";
import { Container, NullData, OrderDetails } from "@/components";
import React from "react";

interface IParams {
  orderId?: string;
}

const EachOrder = async ({ params }: { params: IParams }) => {
  const order = await getOrderById(params);

  if (!order) return <NullData title="No Order Data" />;
  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default EachOrder;
