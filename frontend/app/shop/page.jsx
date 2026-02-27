import Reveal from "../../components/Reveal";
import ProductCard from "../../components/ProductCard";
import { apiGet } from "../../lib/api";
export default async function HomePage() {
  const products = await apiGet("/api/products");

  return (
    <main className="container" style={{ padding: "34px 0 10px" }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <div className="badge">RRe Shop • Animated storefront</div>
            <h1 style={{ margin: "10px 0 6px", fontSize: 46, lineHeight: 1.05 }}>Product Showcase</h1>
            <div style={{ color: "var(--muted)", maxWidth: 680 }}>
              Open a product for details. The <b>Buy</b> button redirects to your custom link.
            </div>
          </div>
          {/* <a className="btn" href="/admin">Admin</a> */}
        </div>
      </Reveal>

      <div style={{ height: 18 }} />

      <div className="grid">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.04}>
            <ProductCard p={p} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
