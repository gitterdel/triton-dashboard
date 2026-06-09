import { put } from "@vercel/blob";

// El agente Triton (corriendo en local) empuja aquí su estado tras cada tick.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const auth = req.headers.authorization ?? "";
  if (auth !== `Bearer ${process.env.TRITON_INGEST_TOKEN}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const body = req.body;
  if (!body || !body.state) return res.status(400).json({ error: "missing state" });

  await put("triton-state.json", JSON.stringify(body), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    contentType: "application/json",
  });

  return res.status(200).json({ ok: true });
}
