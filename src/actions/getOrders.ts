import prisma from "@/lib/prismadb";

export default async function getOrders() {
  try {
    const orders = prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdDate: "desc",
      },
    });

    if (!orders) {
      throw new Error("Order not found in database");
    }

    return orders;
  } catch (error: any) {
    throw new error(error)

  }
}
