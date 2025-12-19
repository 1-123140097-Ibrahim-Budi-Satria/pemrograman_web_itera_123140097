# Aplikasi Manajemen Buku Pribadi

Aplikasi web berbasis React.js untuk mengelola koleksi buku pribadi. Aplikasi ini memungkinkan pengguna untuk mencatat, mengorganisir, dan melacak status buku yang dimiliki, sedang dibaca, atau ingin dibeli.

## Fitur

- Menambahkan buku baru dengan informasi judul, penulis, dan status
- Memperbarui data buku (edit) dan status buku
- Menghapus buku yang sudah tidak diperlukan
- Melakukan pencarian buku berdasarkan judul atau penulis
- Melakukan filtering buku berdasarkan status (Dimiliki, Sedang Dibaca, Ingin Dibeli)
- Melihat statistik koleksi buku dengan visualisasi
- Navigasi multi-halaman (Home dan Statistik)

Semua data buku disimpan menggunakan localStorage. Penggunaan localStorage bertujuan agar data tetap tersimpan walaupun halaman web direfresh atau browser ditutup.

## Cara Menjalankan Aplikasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

### 3. Akses Aplikasi
Buka browser dan akses `http://localhost:5173`

### 4. Jalankan Tests (Opsional)
```bash
npm test
```

## Fitur React yang Diimplementasikan

1. **Functional Components dengan Hooks** - Menggunakan useState, useEffect, useContext, useMemo
2. **Custom Hooks** - useLocalStorage dan useBookStats untuk logika reusable
3. **Context API** - BookContext untuk state management global
4. **React Router** - Navigasi multi-halaman dengan React Router v7
5. **Reusable Components** - BookForm, BookFilter, dan BookList
6. **Controlled Components** - Form input dengan state management
7. **Conditional Rendering** - Menampilkan UI berdasarkan kondisi
8. **Event Handling** - Menangani form submission dan user interactions
9. **Props** - Passing data antar komponen
10. **Lists dan Keys** - Rendering daftar dengan unique keys
11. **Testing** - Unit tests dengan Vitest dan React Testing Library (17 tests)

Link Uji Coba : https://ibrahimbudisatria-pertemuan3.vercel.app/
