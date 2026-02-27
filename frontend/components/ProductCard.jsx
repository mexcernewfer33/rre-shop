"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductCard({ p }) {
  const cover = Array.isArray(p.images) && p.images.length ? p.images[0] : "";

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 3, rotateY: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
      className="card"
    >
      <div style={{ position: "relative", padding: 12 }}>
  <div
    style={{
      height: 190,
      borderRadius: 18,
      background: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}
  >
    <img
      src={cover}
      alt={p.title}
      style={{
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "contain"
      }}
    />
  </div>

  <div style={{ position: "absolute", top: 22, left: 22 }} className="badge">
    € {p.price}
  </div>
</div>

      <div style={{ padding: 14, paddingTop: 2 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.title}</div>
        <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.35 }}>
          {p.description.slice(0, 90)}{p.description.length > 90 ? "…" : ""}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <Link className="btn" href={`/product/${p.id}`} style={{ flex: 1 }}>
            View
          </Link>
          <a className="btn" href={`/checkout?product=${p.id}`} target="_blank" rel="noreferrer">
            Buy
          </a>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(500px 220px at 30% 10%, rgba(255,255,255,0.14), transparent 55%)",
          opacity: 0.45,
          pointerEvents: "none"
        }}
      />
    </motion.div>
  );
}
