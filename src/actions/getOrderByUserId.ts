import prisma from "@/lib/prismadb";

export default async function getOrdersByUserId(userId: string) {
  try {
    const orders = prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdDate: "desc",
      },
      where: {
        userId: userId,
      },
    });

    if (!orders) {
      throw new Error("Order not found in database");
    }

    return orders;
  } catch (error: any) {
    throw new error(error);
  }
}
