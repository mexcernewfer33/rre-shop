"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery({ images = [] }) {
  const safe = useMemo(() => images.filter(Boolean), [images]);
  const [i, setI] = useState(0);
  const cur = safe[i] || safe[0];

  const [loadedSrc, setLoadedSrc] = useState(null);

  /* ---------- preload current image ---------- */
  useEffect(() => {
    if (!cur) return;

    const img = new Image();
    img.src = cur;

    img.onload = () => {
      setLoadedSrc(cur);
    };
  }, [cur]);

  /* ---------- preload neighbors ---------- */
  useEffect(() => {
    if (!safe.length) return;

    const next = safe[(i + 1) % safe.length];
    const prev = safe[(i - 1 + safe.length) % safe.length];

    [next, prev].forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [i, safe]);

  function prev() {
    setLoadedSrc(null);
    setI((v) => (v - 1 + safe.length) % safe.length);
  }

  function next() {
    setLoadedSrc(null);
    setI((v) => (v + 1) % safe.length);
  }

  if (!cur) return null;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative", height: 440 }}>
        <AnimatePresence mode="wait">
          {loadedSrc ? (
            <motion.img
              key={loadedSrc}
              src={loadedSrc}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                inset: 0,
                margin: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain"
              }}
            />
          ) : (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.35)"
              }}
            >
              <div className="badge">Loading…</div>
            </motion.div>
          )}
        </AnimatePresence>

        {safe.length > 1 && (
          <>
            <button
              className="btn"
              onClick={prev}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              ←
            </button>

            <button
              className="btn"
              onClick={next}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              →
            </button>
          </>
        )}
      </div>

      {safe.length > 1 && (
        <div style={{ display: "flex", gap: 10, padding: 12, overflowX: "auto" }}>
          {safe.map((url, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLoadedSrc(null);
                setI(idx);
              }}
              style={{
                border:
                  idx === i
                    ? "1px solid rgba(255,255,255,0.45)"
                    : "1px solid rgba(255,255,255,0.18)",
                borderRadius: 14,
                background: "transparent",
                padding: 0
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 64,
                  borderRadius: 14,
                  backgroundImage: `url(${url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}