import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  (() => {
    console.log("creating new instance");
    return new PrismaClient();
  })();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
