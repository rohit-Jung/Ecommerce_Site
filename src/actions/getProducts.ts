import prisma from "@/lib/prismadb";

export interface IProductParams {
  category?: string | null;
  searhTerm?: string | null;
}

export default async function getProducts(params: IProductParams) {
  try {
    const { category, searhTerm } = params;
    let searchString = searhTerm;

    if (!searchString) {
      searchString = "";
    }

    let query: any = {};

    if (category) {
      query.category = category;
    }

    const products = await prisma.product.findMany({
      where: {
        ...query,
        OR: [
          {
            name: {
              contains: searchString,
              mode: "insensitive",
            },
            description: {
              contains: searchString,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!products) {
      throw new Error(`No products found`);
    }

    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}
