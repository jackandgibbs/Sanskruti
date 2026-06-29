import { PrismaClient } from '@prisma/client';

try {
  const prisma = new PrismaClient();
  console.log("SUCCESS WITH NO ARGS");
} catch (e) {
  console.error("NO ARGS FAILED:", e.stack);
}
