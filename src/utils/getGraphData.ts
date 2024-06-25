import moment from "moment";
import prisma from "@/lib/prismadb";

export default async function getGraphData() {
  try {
    const startDate = moment().subtract(6, "days").startOf("day");
    const endDate = moment().endOf("day");

    //Query database for data of orders from start date to end date whose status is completed
    const result = await prisma.order.groupBy({
      by: "createdDate",
      where: {
        createdDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },
      _sum: {
        amount: true,
      },
    });

    //declare the aggregated data object
    const aggregatedData: {
      [day: string]: { day: string; date: string; totalAmount: number };
    } = {};

    //clone the current date
    const currentDate = startDate.clone();

    //initialize the aggregated data object for each day
    while (currentDate <= endDate) {
      const day = currentDate.format("dddd");
      const date = currentDate.format("YYYY-MM-DD");

      aggregatedData[day] = {
        day,
        date,
        totalAmount: 0,
      };

      currentDate.add(1, "day"); //counter
    }

    //add amount for the data for each day
    result.forEach((item) => {
      const day = moment(item.createdDate).format("dddd");

      const amount = item._sum.amount || 0;

      aggregatedData[day].totalAmount += amount / 100;
    });

    //sort the data by date
    const formattedData = Object.values(aggregatedData).sort((a, b) =>
      moment(a.date).diff(moment(b.date))
    );

    return formattedData;
  } catch (error: any) {
    throw new Error(error);
  }
}
