require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const RAPIDAPI_HOST = "mobile-legends-nickname-region-checker.p.rapidapi.com";
const RAPIDAPI_URL = `https://${RAPIDAPI_HOST}/mobile-legends`;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/check", async (req, res) => {
  const user_id = String(req.body?.user_id ?? "").trim();
  const zone_id = String(req.body?.zone_id ?? "").trim();

  if (!/^\d{1,20}$/.test(user_id) || !/^\d{1,10}$/.test(zone_id)) {
    return res.status(400).json({ error: "User ID dan Zone ID harus berupa angka." });
  }
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY.includes("PASTE_")) {
    return res.status(503).json({ error: "API key belum dipasang di file .env pada server." });
  }

  try {
    const upstream = await fetch(RAPIDAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      },
      body: JSON.stringify({ user_id, zone_id }),
      signal: AbortSignal.timeout(20000)
    });

    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { raw_response: raw }; }

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.message || data?.error || `API provider mengembalikan HTTP ${upstream.status}.`,
        details: data
      });
    }
    return res.json(data);
  } catch (err) {
    return res.status(502).json({
      error: err.name === "TimeoutError"
        ? "Permintaan ke API timeout. Coba lagi."
        : "Tidak dapat menghubungi API provider.",
      details: err.message
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`MLBB Checker berjalan di port ${PORT}`));
