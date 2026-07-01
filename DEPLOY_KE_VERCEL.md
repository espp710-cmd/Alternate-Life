# Panduan Deploy AlternateLife ke Vercel + Redis (Upstash)

Project ini sudah saya modifikasi supaya bisa jalan di Vercel:
- Semua endpoint backend (`/api/save`, `/api/feedback`, `/api/users`, `/api/stats`, `/api/ai-feedback`) sudah diubah jadi **Vercel Serverless Functions** di folder `api/`.
- Semua endpoint pakai **Upstash Redis** (via REST API) untuk simpan data — ini database Redis yang direkomendasikan resmi di Vercel Marketplace.
- `server.ts` lama tetap ada untuk development lokal (`npm run dev`), tidak dipakai saat di Vercel.

## Langkah 1 — Push ke GitHub

1. Buat repo baru di GitHub (public atau private, terserah).
2. Di folder project ini, jalankan:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AlternateLife"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```

## Langkah 2 — Import ke Vercel

1. Buka https://vercel.com/new
2. Login/connect akun GitHub kamu, pilih repo yang baru di-push.
3. Vercel otomatis akan mendeteksi framework **Vite**. Biarkan default (build command `vite build`, output `dist`) — sudah diset lewat `vercel.json`.
4. **Jangan klik Deploy dulu** — lanjut ke Langkah 3 untuk pasang Redis dulu, supaya env variable otomatis terisi.

## Langkah 3 — Pasang Redis (Upstash) dari Vercel Marketplace

1. Di dashboard project Vercel (setelah import, sebelum atau sesudah deploy pertama), buka tab **Storage**.
2. Klik **Create Database** → pilih **Upstash — Redis** (gratis untuk tier awal, cukup untuk trafik kecil-menengah).
3. Pilih region terdekat (misal Singapore, biar latency ke Indonesia rendah).
4. Setelah dibuat, klik **Connect** ke project kamu. Vercel akan otomatis menambahkan environment variable ke project — tapi **nama variabelnya biasanya `KV_REST_API_URL` / `KV_REST_API_TOKEN` atau `REDIS_URL`**, tergantung integrasi.
5. Karena kode saya pakai nama `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`, buka **Settings → Environment Variables** di project Vercel, dan tambahkan manual (copy value dari database yang baru dibuat, biasanya ada di tab Storage → nama database → `.env` tab):
   ```
   UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxx
   ```
6. (Opsional) Kalau mau fitur AI commentary di ending screen aktif, tambahkan juga:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Kalau tidak diisi, aplikasi tetap jalan normal — akan pakai fallback pesan template, tidak error.

## Langkah 4 — Deploy

1. Klik **Deploy** (atau kalau sudah pernah deploy, klik **Redeploy** setelah env variable ditambahkan supaya terbaca).
2. Tunggu build selesai (~1-2 menit).
3. Buka URL yang diberikan Vercel, coba mainkan sampai ending, cek apakah data masuk ke `/api/stats` (buka lewat Admin Dashboard di app).

## Update selanjutnya

Karena sudah connect ke GitHub, setiap kamu `git push` ke branch `main`, Vercel otomatis build & deploy ulang. Tidak perlu upload manual lagi.

## Troubleshooting singkat

- **Data tidak tersimpan / stats kosong**: cek env variable `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` sudah benar dan sudah **Redeploy** setelah menambahkannya (env variable baru tidak otomatis berlaku ke deployment lama).
- **404 di endpoint /api/xxx**: pastikan folder `api/` ikut ter-push ke GitHub (cek `.gitignore` tidak menge-exclude-nya — sudah aman di project ini).
- **Build gagal soal tipe TypeScript**: jalankan `npm run lint` (alias `tsc --noEmit`) di lokal dulu untuk cek.
