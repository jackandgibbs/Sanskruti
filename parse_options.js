const fs = require('fs');

const dtsPath = './node_modules/@prisma/client/index.d.ts';
if (fs.existsSync(dtsPath)) {
  const content = fs.readFileSync(dtsPath, 'utf8');
  const index = content.indexOf('export type PrismaClientOptions');
  if (index !== -1) {
    const chunk = content.substring(index, index + 2000);
    console.log(chunk);
  } else {
    console.log("Not found");
  }
} else {
  console.log("No index.d.ts");
}
