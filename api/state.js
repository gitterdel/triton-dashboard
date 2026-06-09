import { head } from "@vercel/blob";

export default async function handler(_req, res) {
  try {
    const blob = await head("triton-state.json");
    const data = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json());
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(data);
  } catch {
    return res.status(200).json({ state: null, history: [], equity: [] });
  }
}
