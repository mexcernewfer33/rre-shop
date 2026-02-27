"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiAdmin } from "../../lib/api";

function emptyForm() {
  return { title: "", price: 0, description: "", images: [""], buyLink: "", isActive: true };
}

function normalizeImages(arr) {
  const cleaned = (arr || []).map((s) => (s || "").trim()).filter(Boolean);
  return cleaned.length ? cleaned : [];
}

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  async function load() {
    setErr("");
    try {
      const data = await apiAdmin("/api/admin/products");
      setItems(data);
    } catch (e) {
      if (String(e.message) === "401") {
        setErr("Admin login required.");
      } else {
        setErr("Admin API error. Check API URL.");
      }
    }
  }


async function loadOrders() {
  try {
    const list = await apiAdmin(`/api/admin/orders`);
    setOrders(Array.isArray(list) ? list : []);
  } catch {
    // ignore until admin auth is set
  }
}


  useEffect(() => { load(); }, []);

  function setImage(idx, value) {
    setForm((f) => {
      const next = [...f.images];
      next[idx] = value;
      return { ...f, images: next };
    });
  }

  function addImage() { setForm((f) => ({ ...f, images: [...f.images, ""] })); }

  function removeImage(idx) {
    setForm((f) => {
      const next = f.images.filter((_, i) => i !== idx);
      return { ...f, images: next.length ? next : [""] };
    });
  }

  async function submit() {
    setErr("");
    const images = normalizeImages(form.images);

    if (!form.title.trim() || !form.description.trim() || !form.buyLink.trim() || images.length === 0) {
      setErr("Fill Title / Description / Buy link and add at least 1 image URL.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      images,
      buyLink: form.buyLink.trim(),
      isActive: Boolean(form.isActive)
    };

    try {
      if (isEditing) {
        await apiAdmin(`/api/admin/products/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiAdmin("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      }
      setForm(emptyForm());
      setEditingId(null);
      await load();
    } catch {
      setErr("Save failed. Check fields and token.");
    }
  }

  async function remove(id) {
    setErr("");
    try {
      await apiAdmin(`/api/admin/products/${id}`, { method: "DELETE" });
      await load();
    } catch {
      setErr("Delete failed.");
    }
  }


function copyOrderLink(p) {
  try {
    const base = window.location.origin;
    const url = `${base}/checkout?product=${p.id}`;
    navigator.clipboard.writeText(url);
    alert("Copied: " + url);
  } catch {
    alert("Could not copy link");
  }
}

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title ?? "",
      price: p.price ?? 0,
      description: p.description ?? "",
      images: Array.isArray(p.images) && p.images.length ? p.images : [""],
      buyLink: p.buyLink ?? "",
      isActive: Boolean(p.isActive)
    });
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      (p.title || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <main className="container" style={{ padding: "34px 0 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <div className="badge">Admin Panel</div>
          <h1 style={{ margin: "10px 0 0", fontSize: 36 }}>{isEditing ? "Edit product" : "Create product"}</h1>
          {err ? <div style={{ color: "tomato", marginTop: 8 }}>{err}</div> : null}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="btn" href="/">← Store</a>
          <button className="btn" type="button" onClick={() => { sessionStorage.removeItem("rre_admin_basic"); setItems([]); setOrders([]); setErr("Admin login required."); }}>Sign out</button>
          <button className="btn" onClick={() => { setForm(emptyForm()); setEditingId(null); setErr(""); }} type="button">New</button>
        </div>
      </div>
      {err === "Admin login required." ? (
  <div className="card" style={{ padding: 16, marginTop: 12 }}>
    <div style={{ fontWeight: 800, marginBottom: 10 }}>Admin Login</div>

    <div className="row">
      <input
        className="input"
        placeholder="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
    </div>

    <div style={{ height: 12 }} />

    <button
      className="btn"
      type="button"
      onClick={async () => {
        const token = "Basic " + btoa(`${user}:${pass}`);
        sessionStorage.setItem("rre_admin_basic", token);
        setErr("");
        await load();
      }}
    >
      Sign in
    </button>
  </div>
) : null}
      <div style={{ height: 16 }} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card"
        style={{ padding: 16 }}
      >
        <div className="row">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" type="number" placeholder="Price (EUR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>

        <div style={{ height: 12 }} />

        <div className="row">
          <input className="input" placeholder="Buy link (redirect URL)" value={form.buyLink} onChange={(e) => setForm({ ...form, buyLink: e.target.value })} />
          <label style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)" }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Visible on storefront
          </label>
        </div>

        <div style={{ height: 12 }} />
        <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <hr className="sep" />

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>Images</div>
          <button className="btn" onClick={addImage} type="button">+ Add image</button>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {form.images.map((url, idx) => (
            <div key={idx} style={{ display: "grid", gap: 10, gridTemplateColumns: "72px 1fr auto", alignItems: "center" }}>
              <div
                className="thumb"
                style={{
                  backgroundImage: url ? `url(${url})` : "none",
                  backgroundColor: "rgba(255,255,255,0.03)"
                }}
                title="Preview"
              />
              <input className="input" placeholder={`Image URL #${idx + 1}`} value={url} onChange={(e) => setImage(idx, e.target.value)} />
              <button className="btn btnDanger" onClick={() => removeImage(idx)} type="button">Remove</button>
            </div>
          ))}
        </div>

        <div style={{ height: 12 }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={submit} type="button">{isEditing ? "Save changes" : "Create product"}</button>
        </div>
      </motion.div>

      <div style={{ height: 18 }} />

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontWeight: 800 }}>Products</div>
          <input className="input" placeholder="Search…" style={{ maxWidth: 360 }} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div style={{ height: 10 }} />

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cover = Array.isArray(p.images) && p.images.length ? p.images[0] : "";
                return (
                  <tr key={p.id}>
                    <td><div className="thumb" style={{ backgroundImage: cover ? `url(${cover})` : "none" }} /></td>
                    <td style={{ fontWeight: 700 }}>{p.title}</td>
                    <td style={{ color: "var(--muted)" }}>€ {p.price}</td>
                    <td><span className="badge">{p.isActive ? "visible" : "hidden"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button className="btn" onClick={() => startEdit(p)} type="button">Edit</button>
                        <button className="btn" onClick={() => copyOrderLink(p)} type="button">Copy checkout link</button>
                        <button className="btn btnDanger" onClick={() => remove(p.id)} type="button">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length ? (
                <tr>
                  <td colSpan={5} style={{ color: "var(--muted)" }}>No products yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    
<div className="card" style={{ marginTop: 16 }}>
  <div style={{ padding: 16, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
    <div>
      <div className="badge">Orders</div>
      <div style={{ fontWeight: 800, marginTop: 8 }}>Delivery requests</div>
      <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 13 }}>
        New orders created from /checkout will appear here.
      </div>
    </div>
    <button className="btn" type="button" onClick={loadOrders}>Refresh</button>
  </div>

  <div style={{ padding: 16, paddingTop: 0 }}>
    <div style={{ overflowX: "auto" }}>
      <table className="table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: 150 }}>Created</th>
            <th>Customer</th>
            <th>Contact</th>
            <th>Address</th>
            <th style={{ width: 120 }}>Delivery date</th>
            <th style={{ width: 110 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td style={{ color: "var(--muted)" }}>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                <div style={{ fontWeight: 700 }}>{o.customerName}</div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>{o.productTitle} — € {o.productPrice}</div>
              </td>
              <td style={{ color: "var(--muted)" }}>
                <div>{o.phone}</div>
                <div>{o.email}</div>
                {o.telegram ? <div>@{o.telegram.replace(/^@/, "")}</div> : null}
              </td>
              <td style={{ color: "var(--muted)" }}>
                <div>{o.addressLine1}{o.addressLine2 ? `, ${o.addressLine2}` : ""}</div>
                <div>{[o.city, o.country, o.postalCode].filter(Boolean).join(", ")}</div>
              </td>
              <td style={{ color: "var(--muted)" }}>{o.deliveryDate}</td>
              <td>
                <span className="badge">{o.status}</span>
              </td>
            </tr>
          ))}
          {!orders.length ? (
            <tr>
              <td colSpan={6} style={{ color: "var(--muted)" }}>No orders yet.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  </div>
</div>

</main>
  );
}
