"use client";

import { Order } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC } from "react";
import Heading from "../Heading";
import { formatPrice } from "@/utils/formatPrice";
import Status from "../Status";
import { MdAccessTime, MdDeliveryDining, MdDone } from "react-icons/md";
import moment from "moment";
import OrderItem from "./OrderItem";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: FC<OrderDetailsProps> = ({ order }) => {
  const router = useRouter();
  return (
    <>
      <div className="max-w-[1150px] m-auto flex flex-col gap-2">
        <div className="mt-8">
          <Heading title="Order Details" />
        </div>
        <div>Order Id: {order.id}</div>
        <div>
          Total Amount:{" "}
          <span className="font-bold"> {formatPrice(order.amount / 100)}</span>
        </div>
        <div className="flex gap-2 items-center">
          <div>Payment Status:</div>
          <div className="">
            {order.status === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTime}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : order.status === "complete" ? (
              <Status
                text="completed"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div>Delivery Status:</div>
          <div className="">
            {order.deliveryStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTime}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : order.deliveryStatus === "dispatched" ? (
              <Status
                text="dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : order.deliveryStatus === "delivered" ? (
              <Status
                text="delivered"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>Date: {moment(order.createdDate).fromNow()}</div>

        <div>
          <h2 className="font-semibold mt-4 mb-2">Products Ordered: </h2>
          <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center">
            <div className="col-span-2 justify-self-start uppercase">
              Product
            </div>
            <div className="justify-self-center uppercase">Price</div>
            <div className="justify-self-center uppercase">Qty</div>
            <div className="justify-self-end uppercase">Total</div>
          </div>

          {order.products &&
            order.products.map((product) => {
              return (
                <>
                  <OrderItem key={product.id} product={product} />
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
