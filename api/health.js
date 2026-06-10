import { head } from "@vercel/blob";

// Latido del agente: 200 si el último tick tiene <15 min; 503 si no.
// Pensado para un monitor externo (UptimeRobot) que alerte por email/móvil
// ante CUALQUIER modo de fallo silencioso (VPS caído, proceso zombi, red...).
export default async function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const blob = await head("triton-state.json");
    const data = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json());
    const ageMin = (Date.now() - Date.parse(data?.state?.lastTick ?? 0)) / 60000;
    if (Number.isFinite(ageMin) && ageMin < 15) {
      return res.status(200).json({ ok: true, lastTick: data.state.lastTick, ageMin: Math.round(ageMin) });
    }
    return res.status(503).json({ ok: false, lastTick: data?.state?.lastTick ?? null, ageMin: Math.round(ageMin) });
  } catch (e) {
    return res.status(503).json({ ok: false, error: String(e).slice(0, 120) });
  }
}
