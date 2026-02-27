import crypto from "crypto";

function safeEq(a, b) {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
}

export function requireBasicAdmin(req, res, next) {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Basic ")) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Admin Panel"');
        return res.status(401).json({ error: "Unauthorized" });
    }

    const base64 = header.slice("Basic ".length);
    let decoded = "";
    try {
        decoded = Buffer.from(base64, "base64").toString("utf8");
    } catch {
        res.setHeader("WWW-Authenticate", 'Basic realm="Admin Panel"');
        return res.status(401).json({ error: "Unauthorized" });
    }

    const [user, pass] = decoded.split(":");

    const envUser = process.env.ADMIN_USER || "";
    const envPass = process.env.ADMIN_PASS || "";

    if (!user || !pass || !safeEq(user, envUser) || !safeEq(pass, envPass)) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Admin Panel"');
        return res.status(401).json({ error: "Unauthorized" });
    }

    next();
}