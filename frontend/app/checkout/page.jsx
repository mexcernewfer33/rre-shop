"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL, apiGet } from "../../lib/api";
import Link from "next/link";

export default function CheckoutPage({ searchParams }) {
  const productId = searchParams?.product || "";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [createdId, setCreatedId] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    telegram: "",
    deliveryDate: "",
    country: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    notes: ""
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setErr("");
      setLoading(true);
      try {
        if (!productId) throw new Error("No product selected");
        const p = await apiGet(`/api/products/${productId}`);
        if (mounted) setProduct(p);
      } catch (e) {
        if (mounted) setErr("Could not load product. Open this page from the Shop.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [productId]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  
  function validate() {
    const problems = [];
    if (!form.customerName.trim()) problems.push("Full name is required.");
    if (!form.phone.trim()) problems.push("Phone is required.");
    if (!form.email.trim()) problems.push("Email is required.");
    if (!form.deliveryDate) problems.push("Delivery date is required.");
    if (!form.addressLine1.trim()) problems.push("Address line 1 is required.");
    return problems;
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const problems = validate();
    if (problems.length) {
      setErr(problems.join(" "));
      return;
    }
    try {
      if (!productId) throw new Error("No product selected");
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, ...form })
      });
      if (!res.ok) {
        let msg = "";
        try {
          const j = await res.json();
          msg = j?.error || j?.message || "";
        } catch {
          msg = await res.text();
        }
        throw new Error(msg || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setCreatedId(data.id || "");
    } catch (e) {
      setErr(e?.message || "Please check the form and try again.");
    }
  }


  const disabledPayMsg = useMemo(() => {
    return "Payment buttons are placeholders. You will receive payment instructions after order confirmation.";
  }, []);

  return (
    <main className="container" style={{ padding: "34px 0 10px" }}>
      <div className="badge">Checkout</div>
      <h1 style={{ margin: "10px 0 0", fontSize: 34 }}>Delivery details</h1>
      <p style={{ color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
        Fill in delivery info first. Then you can choose a payment method.
      </p>

      {loading ? (
        <div style={{ marginTop: 18, color: "var(--muted)" }}>Loading…</div>
      ) : err ? (
        <div style={{ marginTop: 18 }} className="card">
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Error</div>
            <div style={{ color: "var(--muted)" }}>{err}</div>
            <div style={{ marginTop: 12 }}>
              <Link className="btn" href="/shop">Go to shop</Link>
            </div>
          </div>
        </div>
      ) : createdId ? (
        <div className="card" style={{ marginTop: 18 }}>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Order created ✅</div>
            <div style={{ color: "var(--muted)", marginTop: 8 }}>
              Order ID: <span style={{ color: "var(--text)" }}>{createdId}</span>
            </div>

            <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700 }}>Payment</div>
              <div style={{ color: "var(--muted)", marginTop: 6 }}>{disabledPayMsg}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <button
  className="btn"
  onClick={() =>
    window.location.href =
      "https://rre-shop-payments.onrender.com/card/"
  }
>
  Pay by card
</button>

<button
  className="btn"
  onClick={() =>
    window.location.href =
      "https://rre-shop-payments.onrender.com/paypal/"
  }
>
  Pay with PayPal
</button>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn" href="/shop">Back to shop</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 18 }}>
          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 800 }}>{product?.title}</div>
                <div style={{ color: "var(--muted)", marginTop: 4 }}>€ {product?.price}</div>
              </div>
              <Link className="btn" href={`/product/${productId}`} style={{ background: "rgba(255,255,255,0.03)" }}>
                View product
              </Link>
            </div>

            <form onSubmit={submit} style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                <input className="input" placeholder="Full name *" value={form.customerName} onChange={(e)=>setField("customerName", e.target.value)} />
                <input className="input" placeholder="Phone *" value={form.phone} onChange={(e)=>setField("phone", e.target.value)} />
              </div>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                <input className="input" placeholder="Email *" value={form.email} onChange={(e)=>setField("email", e.target.value)} />
                <input className="input" placeholder="Telegram (optional)" value={form.telegram} onChange={(e)=>setField("telegram", e.target.value)} />
              </div>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                <input className="input" type="date" value={form.deliveryDate} required onChange={(e)=>setField("deliveryDate", e.target.value)} />
                <input className="input" placeholder="City" value={form.city} onChange={(e)=>setField("city", e.target.value)} />
              </div>

              <input className="input" placeholder="Address line 1 *" value={form.addressLine1} onChange={(e)=>setField("addressLine1", e.target.value)} />
              <input className="input" placeholder="Address line 2" value={form.addressLine2} onChange={(e)=>setField("addressLine2", e.target.value)} />

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr" }}>
                <input className="input" placeholder="Country" value={form.country} onChange={(e)=>setField("country", e.target.value)} />
                <input className="input" placeholder="Postal code" value={form.postalCode} onChange={(e)=>setField("postalCode", e.target.value)} />
                <input className="input" placeholder="Notes (optional)" value={form.notes} onChange={(e)=>setField("notes", e.target.value)} />
              </div>

              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                Fields marked with * are required.
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                <button className="btn" type="submit">Create order</button>
                <Link className="btn" href="/shop" style={{ background: "rgba(255,255,255,0.03)" }}>Cancel</Link>
              </div>

              {err ? <div style={{ color: "#ffb4b4", marginTop: 8 }}>{err}</div> : null}
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
