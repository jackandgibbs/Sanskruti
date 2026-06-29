import { PrismaClient } from '@prisma/client';

try {
  const prisma = new PrismaClient({ log: ['query'] });
  console.log("SUCCESS WITH LOG");
} catch(e) {
  console.error("LOG FAILED:", e.message);
}

try {
  const prisma2 = new PrismaClient({
    datasources: { db: { url: "file:./dev.db" } }
  });
  console.log("SUCCESS WITH DATASOURCES");
} catch (e) {
  console.error("DATASOURCES FAILED:", e.message);
}

try {
  const prisma3 = new PrismaClient({
    datasourceUrl: "file:./dev.db"
  });
  console.log("SUCCESS WITH DATASOURCEURL");
} catch (e) {
  console.error("DATASOURCEURL FAILED:", e.message);
}
