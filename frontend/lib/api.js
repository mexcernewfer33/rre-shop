export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function apiAdmin(path, options = {}) {
    const auth =
        typeof window !== "undefined" ?
        window.sessionStorage.getItem("rre_admin_basic") :
        null;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "content-type": "application/json",
            ...(auth ? { Authorization: auth } : {}),
            ...(options.headers || {})
        },
        cache: "no-store"
    });

    if (!res.ok) throw new Error(String(res.status));
    return res.json();
}