# Praktikum 9 - CRUD Using API (Diary App)

Aplikasi buku harian: React Native (Expo) + Node.js/Express + MySQL.

| Folder | Isi |
|---|---|
| `diary-app9` | Frontend mobile (Expo Router + Redux Toolkit) |
| `diary-api` | Backend REST API (Express + MySQL) |
| `docs` | Dokumentasi, koleksi Postman, dan screenshot bukti |

## Menjalankan

Backend:

    cd diary-api
    copy .env.example .env      # isi sesuai konfigurasi MySQL
    npm install
    npm run dev

Frontend:

    cd diary-app9
    copy .env.example .env      # isi IP laptop, contoh http://192.168.1.10:3000
    npm install
    npx expo start -c