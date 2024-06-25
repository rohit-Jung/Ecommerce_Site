"use client";

import { Order, Product, User } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import Heading from "../Heading";
import { formatPrice } from "@/utils/formatPrice";
import { formatNumber } from "@/utils/formatNumber";

interface SummaryProps {
  products: Product[];
  orders: Order[];
  users: User[];
}

type SummaryDataType = {
  [key: string]: {
    label: string;
    digit: number;
  };
};

const Summary: FC<SummaryProps> = ({ products, orders, users }) => {
  const [summaryData, setSummaryData] = useState<SummaryDataType>({
    sales: {
      label: "Total Sale",
      digit: 0,
    },
    products: {
      label: "Total Products",
      digit: 0,
    },
    orders: {
      label: "Total Orders",
      digit: 0,
    },
    paidOrders: {
      label: "Total Paid Orders",
      digit: 0,
    },
    unpaidOrders: {
      label: "Total Unpaid Orders",
      digit: 0,
    },
    users: {
      label: "Total Users",
      digit: 0,
    },
  });

  useEffect(() => {
    setSummaryData((prev) => {
      let tempData = { ...prev };

      const totalSales = orders.reduce((acc, item) => {
        if (item.status === "complete") {
          return acc + item.amount / 100;
        } else {
          return acc;
        }
      }, 0);

      console.log("Total Sales: " + totalSales);

      const paidOrders = orders.filter((item) => item.status === "complete");

      const unpaidOrders = orders.filter((item) => item.status === "pending");

      tempData.sales.digit = totalSales;
      tempData.orders.digit = orders.length;
      tempData.paidOrders.digit = paidOrders.length;
      tempData.unpaidOrders.digit = unpaidOrders.length;
      tempData.products.digit = products.length;
      tempData.users.digit = users.length;

      return tempData;
    });
  }, [orders, products, users]);

  const summeryKeys = Object.keys(summaryData);
  return (
    <>
      <div className="max-w-[1150px] m-auto">
        <div className="mb-4 mt-8">
          <Heading title="Stats" center />
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          {summeryKeys &&
            summeryKeys.map((key) => {
              return (
                <div
                  key={key}
                  className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition"
                >
                  <div className="text-xl md:text-4xl font-bold">
                    {summaryData[key].label === "Total Sale" ? (
                      <>{formatPrice(summaryData[key].digit)}</>
                    ) : (
                      <>{formatNumber(summaryData[key].digit)}</>
                    )}
                  </div>
                  <div className="font-medium">{summaryData[key].label}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Summary;
