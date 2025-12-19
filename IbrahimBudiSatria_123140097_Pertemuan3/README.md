# 📚 BookManager - Aplikasi Manajemen Buku Pribadi

Aplikasi web untuk mengelola koleksi buku pribadi dengan fitur lengkap untuk mencatat, mengorganisir, dan melacak status buku-buku Anda.

**Dibuat oleh:** Ibrahim Budi Satria (123140097)  
**Mata Kuliah:** Pemrograman Web - Praktikum Pertemuan 3  
**Teknologi:** React.js + Vite

---

## 📖 Deskripsi Aplikasi

BookManager adalah aplikasi Single Page Application (SPA) yang memungkinkan pengguna untuk:
- ✅ Menambah buku baru ke koleksi
- ✏️ Mengedit informasi buku yang sudah ada
- 🗑️ Menghapus buku dari koleksi
- 🔍 Mencari buku berdasarkan judul atau penulis
- 🏷️ Memfilter buku berdasarkan status (Dimiliki, Sedang Dibaca, Ingin Dibeli)
- 📊 Melihat statistik koleksi buku

Data disimpan secara lokal menggunakan **localStorage** sehingga tetap tersimpan meskipun browser ditutup.

---

## 🚀 Instalasi dan Menjalankan Aplikasi

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

### 1. **Functional Components dengan Hooks**
Semua komponen menggunakan functional components dengan React Hooks:
- `useState` - Untuk state management lokal
- `useEffect` - Untuk side effects dan lifecycle
- `useContext` - Untuk mengakses Context API
- `useMemo` - Untuk optimasi perhitungan
- `useLocation` - Dari React Router untuk routing

**Contoh Implementasi:**
```jsx
const BookForm = ({ bookToEdit, onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const { addBook, updateBook } = useBooks();
  
  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
    }
  }, [bookToEdit]);
  
  // ... rest of component
};
```

### 2. **Custom Hooks** (2 Custom Hooks)

#### a. `useLocalStorage`
Hook untuk mengelola state yang disimpan di localStorage dengan auto-sync.

```javascript
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);
  
  return [storedValue, setStoredValue];
};
```

**Kegunaan:**
- Otomatis menyimpan data ke localStorage
- Otomatis load data saat komponen mount
- Reusable untuk berbagai kebutuhan penyimpanan lokal

#### b. `useBookStats`
Hook untuk menghitung statistik buku dengan optimasi menggunakan `useMemo`.

```javascript
const useBookStats = (books) => {
  const stats = useMemo(() => {
    const total = books.length;
    const owned = books.filter(book => book.status === 'milik').length;
    // ... perhitungan statistik lainnya
    return { total, owned, reading, wishlist, ... };
  }, [books]);
  
  return stats;
};
```

**Kegunaan:**
- Menghitung statistik koleksi buku
- Optimasi dengan useMemo untuk menghindari re-calculation
- Dapat digunakan di berbagai komponen

### 3. **Context API untuk State Management**

**BookContext** mengelola state global aplikasi:

```jsx
const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useLocalStorage('books', []);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const addBook = (book) => { /* ... */ };
  const updateBook = (id, updatedBook) => { /* ... */ };
  const deleteBook = (id) => { /* ... */ };
  const getFilteredBooks = () => { /* ... */ };
  
  return (
    <BookContext.Provider value={{ 
      books, addBook, updateBook, deleteBook, 
      filterStatus, setFilterStatus, searchQuery, setSearchQuery, 
      getFilteredBooks 
    }}>
      {children}
    </BookContext.Provider>
  );
};
```

**Manfaat:**
- State management global tanpa prop drilling
- Semua komponen dapat mengakses data buku
- Fungsi-fungsi CRUD tersentralisasi

### 4. **React Router** untuk Navigasi Multi-halaman

Implementasi routing dengan React Router v7:

```jsx
<Router>
  <BookProvider>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  </BookProvider>
</Router>
```

**Halaman yang tersedia:**
- `/` - Halaman Beranda (manajemen buku)
- `/stats` - Halaman Statistik

### 5. **Reusable Components** (3+ Komponen)

#### a. BookForm
Komponen form untuk tambah/edit buku dengan controlled components.

**Fitur:**
- Validasi input (min 3 karakter)
- Error handling
- Support mode add dan edit
- Reset form functionality

#### b. BookFilter
Komponen untuk filter dan search buku.

**Fitur:**
- Search berdasarkan judul/penulis
- Filter berdasarkan status
- Active state pada filter button

#### c. BookList
Komponen untuk menampilkan daftar buku.

**Fitur:**
- Card-based layout
- Edit dan delete actions
- Modal untuk edit
- Empty state
- Conditional rendering

### 6. **Controlled Components**

Semua form input menggunakan controlled components pattern:

```jsx
<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

### 7. **Conditional Rendering**

Aplikasi menggunakan conditional rendering di berbagai tempat:

```jsx
{filteredBooks.length === 0 ? (
  <EmptyState />
) : (
  <BookCards books={filteredBooks} />
)}

{showEditModal && <EditModal />}

{errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
```

### 8. **Event Handling**

Berbagai event handler diimplementasikan:
- Form submission
- Input changes
- Button clicks
- Modal close/open

### 9. **Props dan Props Validation**

Komponen menerima dan menggunakan props:

```jsx
const BookForm = ({ bookToEdit, onClose }) => {
  // bookToEdit: untuk edit mode
  // onClose: callback untuk close modal
};
```

### 10. **Lists dan Keys**

Rendering lists dengan proper keys:

```jsx
{books.map(book => (
  <BookCard key={book.id} book={book} />
))}
```

---

## 🧪 Testing

Aplikasi dilengkapi dengan **5+ unit tests** menggunakan **Vitest** dan **React Testing Library**.

### Test Files

1. **BookForm.test.jsx** (5 tests)
   - ✅ Rendering form elements
   - ✅ Validasi field kosong
   - ✅ Validasi minimum length
   - ✅ Update input values
   - ✅ Reset button functionality

2. **BookFilter.test.jsx** (3 tests)
   - ✅ Rendering filter elements
   - ✅ Default active filter
   - ✅ Search input functionality

3. **useLocalStorage.test.js** (3 tests)
   - ✅ Initialize with default value
   - ✅ Update stored value
   - ✅ Handle array values

4. **useBookStats.test.js** (4 tests)
   - ✅ Empty books statistics
   - ✅ Calculate stats correctly
   - ✅ Calculate percentages
   - ✅ Most common author

5. **BookContext.test.jsx** (2 tests)
   - ✅ Context provider works
   - ✅ Initial state validation

### Menjalankan Tests

```bash
# Run all tests
npm run test

# Run tests dengan watch mode
npm run test -- --watch

# Run tests dengan UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Hasil Testing

```
✓ src/__tests__/BookForm.test.jsx (5 tests)
✓ src/__tests__/BookFilter.test.jsx (3 tests)
✓ src/__tests__/useLocalStorage.test.js (3 tests)
✓ src/__tests__/useBookStats.test.js (4 tests)
✓ src/__tests__/BookContext.test.jsx (2 tests)

Total: 17 tests passed
```

---

## 📁 Struktur Folder

```
IbrahimBudiSatria_123140097_Pertemuan3/
├── src/
│   ├── components/           # Reusable components
│   │   ├── BookForm/
│   │   │   ├── BookForm.jsx
│   │   │   └── BookForm.css
│   │   ├── BookFilter/
│   │   │   ├── BookFilter.jsx
│   │   │   └── BookFilter.css
│   │   └── BookList/
│   │       ├── BookList.jsx
│   │       └── BookList.css
│   ├── pages/                # Page components
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   └── Stats/
│   │       ├── Stats.jsx
│   │       └── Stats.css
│   ├── hooks/                # Custom hooks
│   │   ├── useLocalStorage.js
│   │   └── useBookStats.js
│   ├── context/              # Context API
│   │   └── BookContext.jsx
│   ├── __tests__/            # Test files
│   │   ├── BookForm.test.jsx
│   │   ├── BookFilter.test.jsx
│   │   ├── BookContext.test.jsx
│   │   ├── useLocalStorage.test.js
│   │   └── useBookStats.test.js
│   ├── App.jsx              # Main App component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   └── setupTests.js        # Test setup
├── public/                   # Static assets
├── screenshots/              # Application screenshots
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── README.md                # Documentation
```

---

## 🎨 Desain dan UI/UX

### Design Principles
- **Modern & Clean**: Interface yang bersih dan modern
- **Responsive**: Bekerja di desktop dan mobile
- **User-Friendly**: Intuitif dan mudah digunakan
- **Visual Feedback**: Animasi dan transisi yang smooth

### Color Scheme
- Primary: `#3498db` (Blue)
- Success: `#2ecc71` (Green)
- Warning: `#f39c12` (Orange)
- Danger: `#e74c3c` (Red)
- Dark: `#2c3e50`
- Light: `#f5f6fa`

### Features
- Gradient backgrounds
- Card-based layout
- Hover effects dan transitions
- Modal dialogs
- Status badges dengan color coding
- Progress bars untuk statistik
- Empty states dengan icons

---

## 💡 Teknologi dan Dependencies

### Core Technologies
- **React** 19.2.0 - UI Library
- **Vite** 7.2.4 - Build tool dan dev server
- **React Router DOM** 7.11.0 - Routing

### Testing
- **Vitest** - Test runner
- **@testing-library/react** - React testing utilities
- **@testing-library/jest-dom** - Custom matchers
- **jsdom** - DOM implementation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🔒 Error Handling

Aplikasi memiliki error handling untuk:
1. **Form Validation**: Validasi input dengan error messages
2. **Empty States**: Pesan ketika tidak ada data
3. **LocalStorage Errors**: Try-catch untuk localStorage operations
4. **Delete Confirmation**: Konfirmasi sebelum menghapus data

---

## 📝 Fitur Tambahan

1. **Auto-save**: Data otomatis tersimpan ke localStorage
2. **Timestamp**: Mencatat waktu create dan update
3. **Search Highlight**: Real-time search filtering
4. **Status Badges**: Visual indicator status buku
5. **Responsive Navigation**: Mobile-friendly navbar
6. **Progress Indicators**: Visual statistik dengan progress bars
7. **Modal Dialogs**: Edit form dalam modal overlay

---

## 🚀 Future Improvements

Beberapa ide untuk pengembangan selanjutnya:
- [ ] Dark mode support
- [ ] Export/Import data (JSON/CSV)
- [ ] Book cover images
- [ ] Reading progress tracker
- [ ] Book ratings dan reviews
- [ ] Categories/tags untuk buku
- [ ] Sorting options
- [ ] Backend integration dengan API

---

## 📚 Dokumentasi Kode

Semua kode dilengkapi dengan JSDoc comments untuk dokumentasi:

```javascript
/**
 * Custom Hook untuk mengelola state yang disimpan di localStorage
 * @param {string} key - Key untuk localStorage
 * @param {any} initialValue - Nilai default
 * @returns {Array} - [storedValue, setValue]
 */
const useLocalStorage = (key, initialValue) => {
  // implementation
};
```

---

## 👨‍💻 Informasi Pengembang

**Nama:** Ibrahim Budi Satria  
**NIM:** 123140097  
**Mata Kuliah:** Pemrograman Web  
**Pertemuan:** 3 - React.js Fundamentals  

---

## 📄 Lisensi

© 2025 Ibrahim Budi Satria. Aplikasi ini dibuat untuk keperluan praktikum Pemrograman Web.

---

## 🙏 Acknowledgments

- React Documentation
- React Router Documentation
- Vitest Documentation
- React Testing Library
- MDN Web Docs

---

**Happy Coding! 🚀📚**
