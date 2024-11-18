"use client";
import { Order, User } from "@prisma/client";
import { FC, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "../Heading";
import Status from "../Status";
import {
  MdAccessTime,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "../ActionBtn";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

interface ManageOrderClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrderClient: FC<ManageOrderClientProps> = ({ orders }) => {
  const router = useRouter();
  let rows: any[] = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        date: moment(order.createdDate).fromNow(),
        deliveryStatus: order.deliveryStatus,
      };
    });
    
  }
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "customer", headerName: "Customer Name", width: 130 },
    {
      field: "amount",
      headerName: "Amount (USD)",
      width: 130,
      renderCell(params) {
        return (
          <div className="font-bold text-slate-800">{params.row.amount}</div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell(params) {
        return (
          <div className="flex items-center h-full">
            {params.row.paymentStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTime}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.paymentStatus === "complete" ? (
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
        );
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 130,
      renderCell(params) {
        return (
          <div className="flex items-center h-full">
            {params.row.deliveryStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTime}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.deliveryStatus === "dispatched" ? (
              <Status
                text="dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : params.row.deliveryStatus === "delivered" ? (
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
        );
      },
    },
    { field: "date", headerName: "Date", width: 140 },
    {
      field: "action",
      headerName: "Actions",
      width: 190,
      renderCell(params) {
        return (
          <div className="flex justify-between gap-2 w-full h-full items-center pr-3">
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={(e) => {
                handleDispatch(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdDone}
              onClick={(e) => {
                handleDeliver(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={(e) => {
                router.push(`/order/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleDispatch = useCallback(async (id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "dispatched",
      })
      .then((response) => {
        toast.success("Order dispatched successfully");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Oops! Error dispatching the order");
        console.log("Error dispatching the order", error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeliver = useCallback(async (id: string) => {
    axios
      .put("/api/order", {
        id,
        deliveryStatus: "delivered",
      })
      .then((response) => {
        toast.success("Order delivered successfully");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Oops! Error delivering the order");
        console.log("Error delivering the order", error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="max-w-[1150px] m-auto text-xl">
        <div className="mb-4 mt-4">
          <Heading title="Manage orders" center />
        </div>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </>
  );
};

export default ManageOrderClient;
