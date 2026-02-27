/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{ protocol: "https", hostname: "**" }]
    },
    allowedDevOrigins: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://172.20.10.2:3000" // ← твой IP, замени на свой
    ]
};

module.exports = nextConfig;