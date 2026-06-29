import fs from 'fs';

const dtsPath = './node_modules/@prisma/client/index.d.ts';
if (fs.existsSync(dtsPath)) {
  const content = fs.readFileSync(dtsPath, 'utf8');
  const match = content.match(/export type PrismaClientOptions = ([^;]+);/s);
  if (match) {
    console.log(match[0].substring(0, 1000));
  } else {
    console.log("PrismaClientOptions not found");
  }
} else {
  console.log("No index.d.ts");
}
