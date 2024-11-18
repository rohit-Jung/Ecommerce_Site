"use client";
import { Product } from "@prisma/client";
import { FC, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "../Heading";
import Status from "../Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "../ActionBtn";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/lib/firebase";
interface ManageProductClientProps {
  products: Product[];
}

const ManageProductClient: FC<ManageProductClientProps> = ({ products }) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  let rows: any[] = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        images: product.images,
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price (USD)",
      width: 120,
      renderCell(params) {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 120 },
    {
      field: "inStock",
      headerName: "inStock",
      width: 130,
      renderCell(params) {
        return (
          <div className="flex items-center h-full">
            {params.row.inStock ? (
              <Status
                text="in Stock"
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="Out of Stock"
                icon={MdClose}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 190,
      renderCell(params) {
        return (
          <div className="flex justify-between gap-1 w-full h-full items-center pr-5">
            <ActionBtn
              icon={MdCached}
              onClick={(e) => {
                handleToggleStock(params.row.id, params.row.inStock);
              }}
            />
            <ActionBtn
              icon={MdDelete}
              onClick={(e) => {
                handleDeleteProduct(params.row.id, params.row.images);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={(e) => {
                router.push(`/product/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleStock = useCallback(
    async (id: string, inStock: boolean) => {
      await axios
        .put("/api/product", {
          id,
          inStock: !inStock,
        })
        .then((response) => {
          toast.success("Product status toggled successfully");
          router.refresh();
        })
        .catch((error) => {
          toast.error("Oops! Error toggling the status");
          console.log("Error toggling the status", error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDeleteProduct = useCallback(async (id: string, images: any[]) => {
    toast("Deleting Product, Please wait !");

    const handleDeleteImages = async () => {
      try {
        for (const item of images) {
          if (item.image) {
            const imageRef = ref(storage, item.image);
            await deleteObject(imageRef);
            console.log("image deleted", item.image);
          }
        }
      } catch (error) {
        console.log("Error deleting images", error);
      }
    };

    await handleDeleteImages();

    axios
      .delete(`/api/product/${id}`)
      .then((response) => {
        toast.success("Product deleted successfully");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Oops! Error deleting the product");
        console.log("Error deleting the product", error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="max-w-[1150px] m-auto text-xl">
        <div className="mb-4 mt-4">
          <Heading title="Manage Products" center />
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

export default ManageProductClient;
