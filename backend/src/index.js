import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { requireBasicAdmin } from "./middleware/basicAuth.js";

const app = express();

/* ---------------- helpers ---------------- */

function toImagesArray(images) {
  if (!Array.isArray(images)) return [];
  return images.filter(Boolean);
}

/* ---------------- db ---------------- */

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true, default: [] },
    buyLink: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true },
    productPrice: { type: Number, required: true },

    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    telegram: { type: String, trim: true, default: "" },

    deliveryDate: { type: String, required: true }, // keep as ISO yyyy-mm-dd from client
    country: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },

    notes: { type: String, trim: true, default: "" },

    status: { type: String, enum: ["new", "confirmed", "shipped", "delivered", "cancelled"], default: "new" }
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);


async function connectDb() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is missing");
  }
  // Mongoose will reuse the existing connection if already connected.
  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");
}

/* ---------------- middlewares ---------------- */

app.use(express.json({ limit: "2mb" }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map(function (s) {
          return s.trim();
        })
      : "*",
    credentials: false
  })
);

/* ---------------- health ---------------- */

app.get("/health", function (req, res) {
  res.json({ ok: true });
});

/* ======================================================
   PUBLIC API
====================================================== */

app.get("/api/products", async function (req, res) {
  const items = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  const out = items.map(function (p) {
    return {
      ...p,
      id: String(p._id),
      images: toImagesArray(p.images)
    };
  });

  res.json(out);
});

app.get("/api/products/:id", async function (req, res) {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: "Not found" });
  }

  const item = await Product.findOne({ _id: id, isActive: true }).lean();

  if (!item) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    ...item,
    id: String(item._id),
    images: toImagesArray(item.images)
  });
});


/* ---------------- orders ---------------- */

app.post("/api/orders", async function (req, res) {
  try {
    const {
      productId,
      customerName,
      phone,
      email,
      telegram,
      deliveryDate,
      country,
      city,
      addressLine1,
      addressLine2,
      postalCode,
      notes
    } = req.body || {};

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const product = await Product.findOne({ _id: productId, isActive: true }).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (!customerName || !String(customerName).trim()) return res.status(400).json({ error: "customerName is required" });
    if (!phone || !String(phone).trim()) return res.status(400).json({ error: "phone is required" });
    if (!email || !String(email).trim()) return res.status(400).json({ error: "email is required" });
    if (!deliveryDate || !String(deliveryDate).trim()) return res.status(400).json({ error: "deliveryDate is required" });
    if (!addressLine1 || !String(addressLine1).trim()) return res.status(400).json({ error: "addressLine1 is required" });

    const order = await Order.create({
      productId: product._id,
      productTitle: product.title,
      productPrice: product.price,
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      telegram: telegram ? String(telegram).trim() : "",
      deliveryDate: String(deliveryDate).trim(),
      country: country ? String(country).trim() : "",
      city: city ? String(city).trim() : "",
      addressLine1: String(addressLine1).trim(),
      addressLine2: addressLine2 ? String(addressLine2).trim() : "",
      postalCode: postalCode ? String(postalCode).trim() : "",
      notes: notes ? String(notes).trim() : ""
    });

    res.status(201).json({ ok: true, id: String(order._id) });
  } catch (e) {
    console.error("Create order error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ======================================================
   ADMIN API (BASIC AUTH)
====================================================== */

app.get("/api/admin/products", requireBasicAdmin, async function (req, res) {
  const items = await Product.find({}).sort({ createdAt: -1 }).lean();

  const out = items.map(function (p) {
    return {
      ...p,
      id: String(p._id),
      images: toImagesArray(p.images)
    };
  });

  res.json(out);
});

app.post("/api/admin/products", requireBasicAdmin, async function (req, res) {
  const body = req.body || {};
  const title = body.title;
  const price = body.price;
  const description = body.description;
  const images = body.images;
  const buyLink = body.buyLink;
  const isActive = typeof body.isActive === "boolean" ? body.isActive : true;

  if (
    !title ||
    !description ||
    !buyLink ||
    typeof price !== "number" ||
    !Array.isArray(images) ||
    images.length === 0
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const created = await Product.create({
    title,
    price,
    description,
    images: toImagesArray(images),
    buyLink,
    isActive
  });

  const out = created.toObject();
  res.json({
    ...out,
    id: String(out._id),
    images: toImagesArray(out.images)
  });
});

app.put("/api/admin/products/:id", requireBasicAdmin, async function (req, res) {
  const id = req.params.id;
  const body = req.body || {};
  const title = body.title;
  const price = body.price;
  const description = body.description;
  const images = body.images;
  const buyLink = body.buyLink;
  const isActive = body.isActive;

  if (
    !mongoose.isValidObjectId(id) ||
    !title ||
    !description ||
    !buyLink ||
    typeof price !== "number" ||
    !Array.isArray(images) ||
    images.length === 0
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      title,
      price,
      description,
      images: toImagesArray(images),
      buyLink,
      isActive
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    ...updated,
    id: String(updated._id),
    images: toImagesArray(updated.images)
  });
});

app.delete("/api/admin/products/:id", requireBasicAdmin, async function (req, res) {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: "Not found" });
  }

  const removed = await Product.findByIdAndDelete(id).lean();
  if (!removed) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({ ok: true });
});


/* ---------------- admin orders ---------------- */

app.get("/api/admin/orders", requireBasicAdmin, async function (req, res) {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const items = await Order.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  res.json(
    items.map(function (o) {
      return {
        ...o,
        id: String(o._id),
        productId: String(o.productId)
      };
    })
  );
});

app.get("/api/admin/orders/:id", requireBasicAdmin, async function (req, res) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(404).json({ error: "Not found" });
  const o = await Order.findById(id).lean();
  if (!o) return res.status(404).json({ error: "Not found" });
  res.json({ ...o, id: String(o._id), productId: String(o.productId) });
});

app.put("/api/admin/orders/:id", requireBasicAdmin, async function (req, res) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(404).json({ error: "Not found" });
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: "status is required" });

  const updated = await Order.findByIdAndUpdate(
    id,
    { status: String(status) },
    { new: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

/* ---------------- error handler ---------------- */

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

/* ---------------- start server ---------------- */

const port = Number(process.env.PORT || 10000);

connectDb()
  .then(function () {
    app.listen(port, function () {
      console.log("✅ RRe Shop API running on :" + port);
    });
  })
  .catch(function (e) {
    console.error("❌ Failed to start server:", e);
    process.exit(1);
  });
