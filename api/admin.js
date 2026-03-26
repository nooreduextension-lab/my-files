const SUPABASE_URL = "https://rznegxkfwwtqkytkoljs.supabase.co";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://my-files-tau.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SERVICE_KEY) return res.status(500).json({ error: "Missing service key" });

  const { path, method, body } = req.method === "GET"
    ? { path: req.query.path, method: "GET", body: null }
    : req.body;

  const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: method || req.method,
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": method === "PATCH" ? "return=minimal" : "return=representation"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (method === "PATCH" || req.method === "PATCH") {
    return res.status(supabaseRes.ok ? 200 : 500).json({ ok: supabaseRes.ok });
  }

  const data = await supabaseRes.json();
  return res.status(200).json(data);
}
