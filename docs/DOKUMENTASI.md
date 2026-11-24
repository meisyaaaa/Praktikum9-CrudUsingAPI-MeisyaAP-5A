# Dokumentasi Diary App

## Fitur yang ditambahkan

| Tugas modul | Implementasi |
|---|---|
| Favorite dengan PUT | Tombol love di kartu diary -> `PUT /api/diaries/:id` body `{ "liked": 1 }` -> tersimpan di kolom `liked` MySQL |
| Favorites Screen | Tab Favorite hanya menampilkan diary dengan `liked = true` |
| Validasi title >= 3 | Frontend (Create & Edit, Alert) dan backend (HTTP 400 pada POST & PUT) |
| Search | `GET /api/diaries?search=kata` (cari di title, body, mood) + kolom cari di Home (debounce 400 ms) |
| State saving / deleting | `saving` dan `deleting` di Redux; tombol `disabled` + teks "Menyimpan..." / "Menghapus..." |
| Konfirmasi keluar Edit | Listener `beforeRemove` -> Alert "Perubahan belum disimpan" |
| Timestamp created_at | Ditampilkan di Detail Screen ("Dibuat pada") |

## Endpoint

| Method | URL | Keterangan |
|---|---|---|
| GET | `/api/diaries` | Semua diary |
| GET | `/api/diaries?search=kata` | Cari diary |
| GET | `/api/diaries?liked=1` | Hanya favorit |
| GET | `/api/diaries/:id` | Detail |
| POST | `/api/diaries` | Tambah (title min 3 karakter) |
| PUT | `/api/diaries/:id` | Edit data dan/atau `liked` |
| DELETE | `/api/diaries/:id` | Hapus |

## Bukti Postman (screenshot)

1. Buka Postman -> Import -> pilih `docs/postman/diary-api.postman_collection.json`.
2. Pastikan backend jalan (`npm run dev` di `diary-api`) dan variabel `baseUrl` = `http://localhost:3000`.
3. Jalankan request berikut dan screenshot **URL, body (jika ada), status, dan response**.
   Simpan ke folder `docs/screenshots/`:

| File | Request | Status yang diharapkan |
|---|---|---|
| `get.png` | 1. GET semua diary (dan/atau 2. search) | 200 OK |
| `post.png` | 4. POST tambah diary | 201 Created |
| `put.png` | 6. PUT favorite (`liked: 1`) atau 7. PUT edit | 200 OK |
| `delete.png` | 8. DELETE diary | 200 OK |
| `post-invalid.png` (bonus) | 5. POST judul pendek | 400 Bad Request |

Urutan paling aman: jalankan 4 (POST) dulu supaya variabel `id` terisi otomatis, lalu 6, 7, 3, dan terakhir 8 (DELETE).

## Kasus error jaringan: "Tidak dapat terhubung ke server"

**Gejala**
Di HP, Home menampilkan teks merah *"Tidak dapat terhubung ke server..."* (sebelumnya
*"Network request failed"*), padahal di Postman di laptop API berjalan normal.

**Penyebab umum**
- `EXPO_PUBLIC_API_URL` di `diary-app9/.env` memakai `localhost` atau IP lama.
  Di HP, `localhost` berarti HP itu sendiri, bukan laptop. IP laptop juga bisa berubah saat ganti Wi-Fi.
- Windows Firewall memblokir port 3000.
- HP dan laptop tidak berada di jaringan Wi-Fi yang sama.
- Backend belum jalan.

**Cara memperbaiki**
1. Jalankan backend: `cd diary-api; npm run dev` (server listen di `0.0.0.0:3000`).
2. Cek IPv4 laptop: `ipconfig` -> bagian Wi-Fi -> *IPv4 Address*, misalnya `192.168.22.50`.
3. Isi `diary-app9/.env`: `EXPO_PUBLIC_API_URL=http://192.168.22.50:3000`
4. Buka port 3000 di firewall (PowerShell sebagai Administrator):
   `New-NetFirewallRule -DisplayName "Diary API 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow`
5. Tes dari browser HP: `http://192.168.22.50:3000/health` harus menampilkan `{"status":"ok","database":"connected"}`.
6. Restart Expo dengan cache bersih (variabel `.env` dibaca saat bundling): `npx expo start -c`.

**Catatan**
Jika `/health` menjawab `database: disconnected`, masalahnya bukan jaringan HP,
melainkan MySQL di Laragon belum menyala.