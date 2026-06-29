import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- MOCK AUTHENTICATION (OTP) ---
app.post("/api/auth/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });
  
  // MOCK: In a real app, you'd use Twilio here. We just return success.
  console.log(`[MOCK] Sent OTP 1234 to ${phone}`);
  res.json({ success: true, message: "OTP sent successfully (Mock: use 1234)" });
});

app.post("/api/auth/verify-otp", async (req, res) => {
  const { phone, otp, firstName, lastName } = req.body;
  
  if (otp !== "1234") {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { phone } });
  
  if (!user) {
    if (!firstName || !lastName) {
      return res.status(400).json({ error: "First and last name required for new users" });
    }
    // Generate unique customer ID (e.g. SK-10045)
    const count = await prisma.user.count();
    const customerId = `SK-${10000 + count + 1}`;
    
    user = await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        customerId,
        otpVerified: true
      }
    });
  }

  // MOCK JWT: In real app, generate jsonwebtoken
  const token = `mock-jwt-${user.id}`;
  
  res.json({ user, token });
});

// --- USER PROFILE ---
app.get("/api/user/:id", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.put("/api/user/:id", async (req, res) => {
  const { gender, addressStreet, addressCity, addressState, addressZip } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { gender, addressStreet, addressCity, addressState, addressZip }
  });
  res.json(user);
});

// --- PRODUCTS ---
app.get("/api/products", async (req, res) => {
  const { category, isBestSeller, isNewArrival } = req.query;
  const where: any = {};
  
  if (category) where.category = category;
  if (isBestSeller === "true") where.bestSeller = true;
  if (isNewArrival === "true") where.newArrival = true;

  const products = await prisma.product.findMany({ where });
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Admin Route: Create Product
app.post("/api/products", async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Route: Update Product
app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- ORDERS ---
app.post("/api/orders", async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  
  try {
    // Ensure user exists (in case frontend is using a stale mock session)
    let u = await prisma.user.findUnique({ where: { id: userId } });
    if (!u) {
      u = await prisma.user.create({
        data: {
          id: userId,
          firstName: "Guest",
          lastName: "User",
          phone: "GUEST-" + Date.now(),
          customerId: "SK-GUEST-" + Date.now()
        }
      });
    }

    // Ensure all products exist in DB to prevent foreign key constraint violations
    // because frontend uses hardcoded mock products for the storefront.
    for (const item of items) {
      const p = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!p) {
        await prisma.product.create({
          data: {
            id: item.productId,
            name: item.name || "Storefront Product",
            category: "General",
            price: item.price,
            image: "/images/prod_1_1782549574494.png",
            inStock: true,
            stockCount: 100,
          }
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
    
    res.json(order);
  } catch (error: any) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.get("/api/orders/user/:userId", async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.params.userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

// --- MEDIA UPLOAD (HERO VIDEO) ---
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer to save directly to public/hero.mp4
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to the public folder in the React app (which is at the root level relative to server if we're running from root)
    // The server is typically run from the root, so public/ is just 'public'
    cb(null, path.join(process.cwd(), "public"));
  },
  filename: (req, file, cb) => {
    cb(null, "hero.mp4"); // Always overwrite hero.mp4
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.post("/api/upload-hero", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file provided" });
  }
  res.json({ success: true, message: "Hero video updated successfully", file: req.file });
});

// Configure multer for heritage image
const heritageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public"));
  },
  filename: (req, file, cb) => {
    cb(null, "heritage.png"); // Always overwrite heritage.png
  }
});
const uploadHeritage = multer({ 
  storage: heritageStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post("/api/upload-heritage", uploadHeritage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  res.json({ success: true, message: "Heritage image updated successfully", file: req.file });
});

// Configure multer for festive banner
const festiveStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public"));
  },
  filename: (req, file, cb) => {
    cb(null, "festive-banner.png"); // Always overwrite
  }
});
const uploadFestive = multer({ 
  storage: festiveStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post("/api/upload-festive", uploadFestive.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  res.json({ success: true, message: "Festive banner updated successfully", file: req.file });
});

// Configure multer for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public", "products"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prod-' + uniqueSuffix + '.png'); 
  }
});
const uploadProduct = multer({ 
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post("/api/upload-product", uploadProduct.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  // Return the web path, not the absolute file path
  const webPath = "/products/" + req.file.filename;
  res.json({ success: true, message: "Product image uploaded successfully", url: webPath });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
