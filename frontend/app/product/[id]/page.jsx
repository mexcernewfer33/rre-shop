import { apiGet } from "../../../lib/api";
import Reveal from "../../../components/Reveal";
import Gallery from "../../../components/Gallery";

export default async function ProductPage({ params }) {
  const p = await apiGet(`/api/products/${params.id}`);

  return (
    <main className="container" style={{ padding: "34px 0 10px" }}>
      <Reveal>
        <a className="badge" href="/shop">← Back</a>

        <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
          <Gallery images={p.images} />

          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: 34 }}>{p.title}</h1>
              <span className="badge">€ {p.price}</span>
            </div>

            <p style={{ color: "var(--muted)", lineHeight: 1.55, marginTop: 10 }}>{p.description}</p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <a className="btn" href={`/checkout?product=${p.id}`}>Order</a>
              <a className="btn" href="/shop" style={{ background: "rgba(255,255,255,0.03)" }}>Browse more</a>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
