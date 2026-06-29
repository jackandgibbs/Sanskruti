import { PrismaClient } from '@prisma/client';

try {
  const prisma4 = new PrismaClient({
    url: "file:./dev.db"
  });
  console.log("SUCCESS WITH URL");
} catch (e) {
  console.error("URL FAILED:", e.message);
}

try {
  const prisma5 = new PrismaClient({
    connectionString: "file:./dev.db"
  });
  console.log("SUCCESS WITH connectionString");
} catch (e) {
  console.error("connectionString FAILED:", e.message);
}
