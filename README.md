# MLBB Account Checker

Website checker MLBB dengan tampilan gaming neon biru-ungu dan backend proxy RapidAPI.

## Menjalankan
1. Install Node.js 18 atau lebih baru.
2. Salin `.env.example` menjadi `.env`.
3. Isi `RAPIDAPI_KEY` dengan API key RapidAPI yang baru.
4. Jalankan `npm install` lalu `npm start`.
5. Buka `http://localhost:3000`.

Endpoint: `POST https://mobile-legends-nickname-region-checker.p.rapidapi.com/mobile-legends`

API key hanya dibaca dari environment server dan tidak dimasukkan ke HTML/browser.
Respons API ditampilkan sesuai data yang benar-benar dikembalikan provider; website tidak mengarang field yang tidak tersedia.
