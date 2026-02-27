import { SITE } from "../site.config";

export default function Footer() {
  return (
    <footer style={{ marginTop: 60, borderTop: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "22px 0", display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ color: "var(--muted)" }}>© {new Date().getFullYear()} • {SITE.name}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="badge" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a className="badge" href={SITE.telegram} target="_blank" rel="noreferrer">Telegram (klic)</a>
          {/* <a className="badge" href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a> */}
        </div>
      </div>
    </footer>
  );
}