# Diary App: CRUD React Native dengan REST API

Praktikum Mobile Programming, Pertemuan 9: **CRUD Using API**
Program Studi Teknik Informatika, Universitas Muhammadiyah Sukabumi

Nama   : Meisya Amelia Putri
NIM    : 2430511002
Kelas  : 5A

## Deskripsi

Diary App adalah aplikasi buku harian dengan operasi **Create, Read, Update, dan Delete (CRUD)**. Aplikasi mobile (React Native + Expo) berkomunikasi dengan REST API (Node.js + Express), dan REST API menyimpan data ke MySQL. Data tetap tersimpan setelah aplikasi ditutup.

```
React Native (diary-app9) --HTTP/JSON--> Express.js (diary-api) --SQL--> MySQL (diary_app)
```

React Native tidak mengakses MySQL secara langsung. Semua data lewat REST API.

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Mobile | React Native 0.88, Expo SDK 58, Expo Router, TypeScript |
| State management | Redux Toolkit, React-Redux |
| Backend | Node.js (ES Modules), Express.js 4 |
| Database | MySQL, driver `mysql2/promise` |
| Pengujian API | Postman |

## Fitur

**Fitur utama (modul)**
- Menampilkan daftar diary dari MySQL (Read), lengkap dengan tarik-untuk-refresh, loading, error, dan tampilan data kosong
- Menambah diary (Create)
- Melihat detail diary (Read)
- Mengubah diary (Update)
- Menghapus diary dengan konfirmasi (Delete)

**Tugas praktikum yang sudah dikerjakan**

| Tugas | Implementasi |
|---|---|
| Favorite dengan PUT | Tombol love di kartu diary memanggil `PUT /api/diaries/:id` dengan `{ "liked": 1 }`, tersimpan di kolom `liked` |
| Favorites Screen | Tab Favorite hanya menampilkan diary dengan `liked = true` |
| Validasi judul minimal 3 karakter | Di frontend (Create dan Edit) dan backend (HTTP 400 pada POST dan PUT) |
| Pencarian | `GET /api/diaries?search=kata` (mencari di title, body, mood) dan kolom cari di Home dengan debounce 400 ms |
| State saving dan deleting | State `saving` dan `deleting` di Redux, tombol nonaktif saat request berjalan |
| Konfirmasi keluar dari form Edit | Peringatan "Perubahan belum disimpan" saat ada perubahan yang belum disimpan |
| Timestamp `created_at` | Ditampilkan di layar Detail |
| Screenshot Postman | Lihat bagian [Bukti Pengujian Postman](#bukti-pengujian-postman) |
| Dokumentasi kasus error jaringan | Lihat [docs/DOKUMENTASI.md](docs/DOKUMENTASI.md) dan bagian [Troubleshooting](#troubleshooting) |

## Struktur Project

```
mobile-programming/
├── diary-api/                         # Backend REST API
│   ├── src/
│   │   ├── config/database.js         # Koneksi MySQL (pool)
│   │   ├── controllers/diary.controllers.js
│   │   ├── routes/diary.routes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── diary-app9/                        # Aplikasi mobile
│   ├── app/
│   │   ├── _layout.tsx                # Redux Provider + Stack
│   │   ├── (tabs)/                    # index (Home), create, favorites
│   │   ├── detail/[id].tsx
│   │   └── edit/[id].tsx
│   ├── src/
│   │   ├── store/                     # store.ts, hooks.ts
│   │   ├── features/diary/diarySlice.ts
│   │   ├── services/diaryApi.ts       # Fetch API + timeout + pesan error jaringan
│   │   ├── components/DiaryCard.tsx
│   │   └── styles/tokens.ts
│   ├── .env.example
│   └── package.json
└── docs/
    ├── DOKUMENTASI.md                 # Dokumentasi fitur dan kasus error jaringan
    ├── postman/diary-api.postman_collection.json
    └── screenshots/                   # Bukti Postman
```

## Endpoint REST API

| CRUD | Method | Endpoint | Operasi SQL | Status sukses |
|---|---|---|---|---|
| Create | POST | `/api/diaries` | INSERT | 201 Created |
| Read | GET | `/api/diaries` | SELECT | 200 OK |
| Read | GET | `/api/diaries?search=kata` | SELECT ... LIKE | 200 OK |
| Read | GET | `/api/diaries?liked=1` | SELECT ... WHERE liked = 1 | 200 OK |
| Read | GET | `/api/diaries/:id` | SELECT | 200 OK |
| Update | PUT | `/api/diaries/:id` | UPDATE | 200 OK |
| Delete | DELETE | `/api/diaries/:id` | DELETE | 200 OK |

Endpoint tambahan: `GET /` (status API) dan `GET /health` (cek koneksi database).

| Status | Arti | Contoh |
|---|---|---|
| 200 | Berhasil | GET, PUT, DELETE berhasil |
| 201 | Data dibuat | POST berhasil |
| 400 | Input tidak valid | Field wajib kosong, judul kurang dari 3 karakter |
| 404 | Tidak ditemukan | ID diary tidak ada |
| 500 | Kesalahan server atau database | Koneksi MySQL gagal |

**Contoh request POST** `/api/diaries`

```json
{
  "title": "Belajar REST API",
  "diary_date": "2026-11-23",
  "body": "Hari ini saya belajar menghubungkan Express dan MySQL.",
  "mood": "🙂"
}
```

**Contoh request PUT** `/api/diaries/1` (favorite)

```json
{ "liked": 1 }
```

## Bukti Pengujian Postman

Koleksi Postman tersedia di `docs/postman/diary-api.postman_collection.json` (File → Import di Postman, variabel `baseUrl` = `http://localhost:3000`).

### GET: ambil semua diary (200 OK)
<img width="1279" height="757" alt="Post1-GetAll" src="https://github.com/user-attachments/assets/1163b606-591b-4448-b449-4e3726effed7" />

<img width="1278" height="753" alt="Post2-GetOne" src="https://github.com/user-attachments/assets/166a7eb6-e63c-40aa-95dc-dd20fcb870c5" />


### POST: tambah diary (201 Created)
<img width="1270" height="748" alt="Post3-Create" src="https://github.com/user-attachments/assets/b9bc1070-a1c7-4094-abeb-a40f99d86b0a" />


### PUT: ubah diary / favorite (200 OK)
<img width="1279" height="753" alt="Post4-Update" src="https://github.com/user-attachments/assets/0ae68347-2db6-477a-90b2-555917141276" />


### DELETE: hapus diary (200 OK)
<img width="1276" height="751" alt="Post5-Delete" src="https://github.com/user-attachments/assets/6e1536dc-d367-4436-a9be-2117722efe9c" />


## Cara Menjalankan

### Prasyarat

- Node.js LTS dan npm
- MySQL Server (misalnya dari Laragon atau XAMPP)
- Expo Go di HP, atau Android Emulator

### 1. Siapkan database

Jalankan SQL berikut di HeidiSQL, phpMyAdmin, atau MySQL Workbench:

```sql
CREATE DATABASE diary_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE diary_app;

CREATE TABLE diaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  diary_date DATE NOT NULL,
  preview VARCHAR(255),
  body TEXT NOT NULL,
  mood VARCHAR(20) DEFAULT '🙂',
  liked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO diaries (title, diary_date, preview, body, mood, liked) VALUES
('Pagi yang Tenang', '2026-11-23', 'Jalan pagi sebelum memulai aktivitas.',
 'Pagi ini terasa tenang. Saya berjalan selama 20 menit.', '😊', false),
('Produktif di Kampus', '2026-11-22', 'Menyelesaikan modul dan berdiskusi dengan tim.',
 'Hari ini cukup produktif karena beberapa target selesai.', '😄', true);
```

### 2. Jalankan backend

```bash
cd diary-api
copy .env.example .env      # Windows (Linux/macOS: cp .env.example .env)
npm install
npm run dev
```

Isi `.env` sesuai instalasi MySQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=diary_app
```

Jika berhasil, terminal menampilkan `Diary API berjalan pada port 3000`. Buka `http://localhost:3000/health`, harus menampilkan `{"status":"ok","database":"connected"}`.

### 3. Jalankan aplikasi mobile

```bash
cd diary-app9
copy .env.example .env      # Windows (Linux/macOS: cp .env.example .env)
npm install
npx expo start -c
```

Isi `.env` dengan IPv4 laptop (cek dengan `ipconfig`):

```
EXPO_PUBLIC_API_URL=http://192.168.22.50:3000
```

Ganti `192.168.22.50` dengan IP laptop masing-masing. Scan QR code dengan Expo Go. HP dan laptop harus berada di Wi-Fi yang sama. Jangan memakai `localhost` di HP karena `localhost` berarti HP itu sendiri.

## Skenario Pengujian End-to-End

| No | Aksi | Hasil yang diharapkan |
|---|---|---|
| 1 | Buka Home | Data diary dari MySQL tampil |
| 2 | Tarik untuk refresh | List refresh tanpa crash |
| 3 | Tambah diary | Diary baru tampil di Home, row bertambah di MySQL |
| 4 | Buka Detail | Isi sesuai diary yang dipilih |
| 5 | Edit diary | Detail menampilkan data terbaru |
| 6 | Tandai favorite | Muncul di tab Favorite, `liked` berubah di MySQL |
| 7 | Cari diary | Daftar terfilter sesuai kata kunci |
| 8 | Hapus diary | Kembali ke Home, item hilang |
| 9 | Restart aplikasi | Data tetap ada |

## Bukti Pengujian Diary App9 Expo-GO
1. HALAMAN HOME
<img width="738" height="1600" alt="HALAMAN HOME" src="https://github.com/user-attachments/assets/162293c1-2a60-4275-acdb-fe4008826e21" />

2. HALAMAN PENCARIAN
<img width="738" height="1600" alt="pencarian" src="https://github.com/user-attachments/assets/01a0545a-e78e-4890-8c0b-b50beda1f275" />

3. HALAMAN TAMBAH DIARY
<img width="738" height="1600" alt="halamantambahdiary" src="https://github.com/user-attachments/assets/03ed92e0-9450-4892-83c4-e22c5e71c285" />

4. HALAMAN EDIT DIARY
<img width="738" height="1600" alt="HalamanEditDiary" src="https://github.com/user-attachments/assets/f03a715e-9893-452c-9496-2dbfbd7a8f3f" />

5. HALAMAN DETAIL DIARY
<img width="738" height="1600" alt="HalamaDetailDiary" src="https://github.com/user-attachments/assets/8664371a-88ce-4f2b-b55f-4cf5c0859c7c" />

6. HALAMAN FAVORIT
<img width="738" height="1600" alt="HalamanFavorite" src="https://github.com/user-attachments/assets/9f6ca596-1e13-4d9d-80b6-a53b62b6542f" />

7. KONFIRMASI EDIT DIARY
<img width="738" height="1600" alt="konfirmasiEditDiary" src="https://github.com/user-attachments/assets/530f6476-5f2e-46a2-a44e-be6664a0513f" />

8. KONFIRMASI HAPUS DIARY 
<img width="738" height="1600" alt="KonfirmasiHapusDiary" src="https://github.com/user-attachments/assets/9164dfe9-1db7-4c04-b91b-f1e6b61e5e14" />

## Troubleshooting

| Masalah | Penyebab dan solusi |
|---|---|
| `Missing script: "dev"` | Tambahkan `"type": "module"` dan script `dev` di `package.json` backend |
| `ERR_MODULE_NOT_FOUND` | Nama atau lokasi file di `src/` tidak sesuai dengan import |
| `ECONNREFUSED` ke MySQL | Aktifkan MySQL Server dan cek `DB_PORT` |
| `/health` menampilkan `disconnected` | MySQL belum menyala atau `.env` backend salah |
| Postman bisa, HP gagal | Gunakan IPv4 laptop di `EXPO_PUBLIC_API_URL`, lalu `npx expo start -c` |
| `ERR_CONNECTION_TIMED_OUT` dari HP | Izinkan port 3000 di Windows Firewall atau gunakan hotspot HP |
| Home menampilkan "Tidak dapat terhubung ke server" | Lihat kasus lengkap di [docs/DOKUMENTASI.md]|
| `Unmatched Route` di Expo Router | Jangan buat folder `src/app`; simpan store dan hooks di `src/store` |
| `Element type is invalid` | Pastikan setiap file di `app/` memiliki `export default` |

Izinkan port 3000 di firewall (PowerShell sebagai Administrator):

```powershell
New-NetFirewallRule -DisplayName "Diary API 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

## Catatan

- File `.env` berisi konfigurasi lokal dan tidak ikut di-push (sudah ada di `.gitignore`). Gunakan `.env.example` sebagai acuan.
- Query SQL memakai placeholder `?` sehingga input user tidak disisipkan langsung ke string SQL.
- Dokumentasi tambahan ada di [docs/DOKUMENTASI.md](docs/DOKUMENTASI.md).
