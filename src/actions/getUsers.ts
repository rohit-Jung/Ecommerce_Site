import prisma from "@/lib/prismadb";
export default function getUsers() {
  try {
    const users = prisma.user.findMany();
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}
