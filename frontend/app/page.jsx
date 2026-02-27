import Reveal from "../components/Reveal";
import { SITE } from "../site.config";

export default function HomePage() {
  return (
    
    <main className="container" style={{ padding: "46px 0 10px" }}>
      
      <div style={{ display: "grid", gap: 22, gridTemplateColumns: "1.15fr 0.85fr", alignItems: "center" }}>
        <Reveal>
          <div>
            <div className="badge">{SITE.name} • Premium tech store</div>

            <h1 style={{ margin: "12px 0 10px", fontSize: 54, lineHeight: 1.02 }}>
              {SITE.heroTitle}
            </h1>

            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.55, maxWidth: 680 }}>
              {SITE.heroText}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
              <a className="btn" href="/shop">Shop now →</a>
              {/* <a className="btn" href="/admin" style={{ background: "rgba(255,255,255,0.03)" }}>
                Admin
              </a> */}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <span className="badge">Fast delivery</span>
              <span className="badge">Warranty</span>
              <span className="badge">Secure payments</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="card"
            style={{
              height: 520,
              display: "grid",
              placeItems: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* animated “phone” */}
            <div className="phoneWrap">
  <div className="phoneGlow" />

  <div className="phone">
    <div className="phoneNotch" />

    {/* Status bar */}
    <div className="phoneStatus">
      <div className="phoneTime">9:41</div>
      <div className="phoneStatusRight">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <div className="battery">
          <div className="batteryFill" />
        </div>
      </div>
    </div>

    {/* Wallpaper */}
    <div className="phoneWallpaper" />

    {/* App icons grid */}
    <div className="phoneIcons">
      <div className="icon i1"><span>Store</span></div>
      <div className="icon i2"><span>Deals</span></div>
      <div className="icon i3"><span>Chat</span></div>
      <div className="icon i4"><span>Orders</span></div>

      <div className="icon i5"><span>New</span></div>
      <div className="icon i6"><span>Pro</span></div>
      <div className="icon i7"><span>Sale</span></div>
      <div className="icon i8"><span>Help</span></div>
    </div>

    {/* Dock */}
    <div className="phoneDock">
      <div className="dockIcon d1" />
      <div className="dockIcon d2" />
      <div className="dockIcon d3" />
      <div className="dockIcon d4" />
    </div>
  </div>
</div>

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(600px 280px at 30% 10%, rgba(255,255,255,0.14), transparent 55%)",
                opacity: 0.45,
                pointerEvents: "none"
              }}
            />
          </div>
        </Reveal>
      </div>
    </main>
  );
}