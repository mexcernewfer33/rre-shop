"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -260,
          top: -280,
          borderRadius: 9999,
          background: "radial-gradient(circle at 30% 30%, rgba(137,103,255,0.35), transparent 60%)",
          filter: "blur(30px)"
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          right: -280,
          top: -260,
          borderRadius: 9999,
          background: "radial-gradient(circle at 70% 30%, rgba(0,220,255,0.26), transparent 60%)",
          filter: "blur(34px)"
        }}
      />
    </div>
  );
}
