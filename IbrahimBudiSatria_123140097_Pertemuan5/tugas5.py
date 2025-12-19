from abc import ABC, abstractmethod
from datetime import datetime

class LibraryItem(ABC):
    def __init__(self, item_id, title, year):
        self.__item_id = item_id
        self._title = title
        self._year = year
        self._is_available = True
    
    @property
    def item_id(self):
        return self.__item_id
    
    @property
    def title(self):
        return self._title
    
    @title.setter
    def title(self, value):
        if value and len(value) > 0:
            self._title = value
        else:
            raise ValueError("Title tidak boleh kosong")
    
    @property
    def is_available(self):
        return self._is_available
    
    @is_available.setter
    def is_available(self, value):
        self._is_available = value
    
    @abstractmethod
    def display_info(self):
        pass
    
    @abstractmethod
    def get_item_type(self):
        pass
    
    def borrow(self):
        if self._is_available:
            self._is_available = False
            return f"{self._title} berhasil dipinjam"
        return f"{self._title} sedang tidak tersedia"
    
    def return_item(self):
        self._is_available = True
        return f"{self._title} berhasil dikembalikan"


class Book(LibraryItem):
    def __init__(self, item_id, title, year, author, isbn, pages):
        super().__init__(item_id, title, year)
        self._author = author
        self.__isbn = isbn
        self._pages = pages
    
    @property
    def author(self):
        return self._author
    
    @property
    def isbn(self):
        return self.__isbn
    
    @property
    def pages(self):
        return self._pages
    
    def display_info(self):
        status = "Tersedia" if self._is_available else "Dipinjam"
        return f"""
        ID: {self.item_id}
        Tipe: Buku
        Judul: {self._title}
        Penulis: {self._author}
        ISBN: {self.__isbn}
        Tahun: {self._year}
        Halaman: {self._pages}
        Status: {status}
        """
    
    def get_item_type(self):
        return "Book"


class Magazine(LibraryItem):
    def __init__(self, item_id, title, year, publisher, issue_number, month):
        super().__init__(item_id, title, year)
        self._publisher = publisher
        self._issue_number = issue_number
        self._month = month
    
    @property
    def publisher(self):
        return self._publisher
    
    @property
    def issue_number(self):
        return self._issue_number
    
    @property
    def month(self):
        return self._month
    
    def display_info(self):
        status = "Tersedia" if self._is_available else "Dipinjam"
        return f"""
        ID: {self.item_id}
        Tipe: Majalah
        Judul: {self._title}
        Penerbit: {self._publisher}
        Edisi: {self._issue_number}
        Bulan: {self._month}
        Tahun: {self._year}
        Status: {status}
        """
    
    def get_item_type(self):
        return "Magazine"


class DVD(LibraryItem):
    def __init__(self, item_id, title, year, director, duration):
        super().__init__(item_id, title, year)
        self._director = director
        self._duration = duration
    
    @property
    def director(self):
        return self._director
    
    @property
    def duration(self):
        return self._duration
    
    def display_info(self):
        status = "Tersedia" if self._is_available else "Dipinjam"
        return f"""
        ID: {self.item_id}
        Tipe: DVD
        Judul: {self._title}
        Sutradara: {self._director}
        Durasi: {self._duration} menit
        Tahun: {self._year}
        Status: {status}
        """
    
    def get_item_type(self):
        return "DVD"


class Library:
    def __init__(self, name):
        self.__name = name
        self.__items = []
        self.__next_id = 1
    
    @property
    def name(self):
        return self.__name
    
    @property
    def total_items(self):
        return len(self.__items)
    
    def add_item(self, item):
        """Menambahkan item ke perpustakaan"""
        if isinstance(item, LibraryItem):
            self.__items.append(item)
            return f"Item '{item.title}' berhasil ditambahkan ke perpustakaan"
        else:
            return "Error: Item harus merupakan instance dari LibraryItem"
    
    def display_all_items(self):
        """Menampilkan semua item di perpustakaan"""
        if not self.__items:
            print("\nPerpustakaan kosong.")
            return
        
        print(f"\n{'='*60}")
        print(f"Daftar Item di Perpustakaan {self.__name}")
        print(f"{'='*60}")
        
        for item in self.__items:
            print(item.display_info())
            print("-" * 60)
    
    def display_available_items(self):
        """Menampilkan item yang tersedia"""
        available = [item for item in self.__items if item.is_available]
        
        if not available:
            print("\nTidak ada item yang tersedia saat ini.")
            return
        
        print(f"\n{'='*60}")
        print(f"Item Tersedia di Perpustakaan {self.__name}")
        print(f"{'='*60}")
        
        for item in available:
            print(item.display_info())
            print("-" * 60)
    
    def search_by_title(self, title):
        """Mencari item berdasarkan judul"""
        results = [item for item in self.__items if title.lower() in item.title.lower()]
        
        if not results:
            print(f"\nTidak ditemukan item dengan judul '{title}'")
            return None
        
        print(f"\n{'='*60}")
        print(f"Hasil Pencarian: '{title}'")
        print(f"{'='*60}")
        
        for item in results:
            print(item.display_info())
            print("-" * 60)
        
        return results
    
    def search_by_id(self, item_id):
        """Mencari item berdasarkan ID"""
        for item in self.__items:
            if item.item_id == item_id:
                print(f"\n{'='*60}")
                print(f"Item Ditemukan (ID: {item_id})")
                print(f"{'='*60}")
                print(item.display_info())
                return item
        
        print(f"\nTidak ditemukan item dengan ID '{item_id}'")
        return None
    
    def borrow_item(self, item_id):
        """Meminjam item berdasarkan ID"""
        item = self.search_by_id(item_id)
        if item:
            print(item.borrow())
    
    def return_item(self, item_id):
        """Mengembalikan item berdasarkan ID"""
        item = self.search_by_id(item_id)
        if item:
            print(item.return_item())
    
    def get_statistics(self):
        """Menampilkan statistik perpustakaan"""
        total = len(self.__items)
        available = sum(1 for item in self.__items if item.is_available)
        borrowed = total - available
        
        books = sum(1 for item in self.__items if item.get_item_type() == "Book")
        magazines = sum(1 for item in self.__items if item.get_item_type() == "Magazine")
        dvds = sum(1 for item in self.__items if item.get_item_type() == "DVD")
        
        print(f"\n{'='*60}")
        print(f"Statistik Perpustakaan {self.__name}")
        print(f"{'='*60}")
        print(f"Total Item: {total}")
        print(f"Item Tersedia: {available}")
        print(f"Item Dipinjam: {borrowed}")
        print(f"\nBerdasarkan Tipe:")
        print(f"  - Buku: {books}")
        print(f"  - Majalah: {magazines}")
        print(f"  - DVD: {dvds}")
        print(f"{'='*60}")


def main():
    library = Library("Perpustakaan Kampus")
    
    while True:
        print("\n" + "="*60)
        print(f"SISTEM MANAJEMEN PERPUSTAKAAN - {library.name}")
        print("="*60)
        print("1. Tampilkan semua item")
        print("2. Tampilkan item yang tersedia")
        print("3. Cari item berdasarkan judul")
        print("4. Cari item berdasarkan ID")
        print("5. Pinjam item")
        print("6. Kembalikan item")
        print("7. Tambah item baru")
        print("8. Statistik perpustakaan")
        print("9. Keluar")
        print("="*60)
        
        pilihan = input("Pilih menu (1-9): ")
        
        if pilihan == "1":
            library.display_all_items()
        
        elif pilihan == "2":
            library.display_available_items()
        
        elif pilihan == "3":
            judul = input("Masukkan judul yang dicari: ")
            library.search_by_title(judul)
        
        elif pilihan == "4":
            item_id = input("Masukkan ID item: ")
            library.search_by_id(item_id)
        
        elif pilihan == "5":
            item_id = input("Masukkan ID item yang ingin dipinjam: ")
            library.borrow_item(item_id)
        
        elif pilihan == "6":
            item_id = input("Masukkan ID item yang ingin dikembalikan: ")
            library.return_item(item_id)
        
        elif pilihan == "7":
            print("\nTipe Item:")
            print("1. Buku")
            print("2. Majalah")
            print("3. DVD")
            tipe = input("Pilih tipe item (1-3): ")
            
            item_id = input("Masukkan ID: ")
            judul = input("Masukkan judul: ")
            tahun = int(input("Masukkan tahun: "))
            
            if tipe == "1":
                penulis = input("Masukkan penulis: ")
                isbn = input("Masukkan ISBN: ")
                halaman = int(input("Masukkan jumlah halaman: "))
                item = Book(item_id, judul, tahun, penulis, isbn, halaman)
            
            elif tipe == "2":
                penerbit = input("Masukkan penerbit: ")
                edisi = input("Masukkan nomor edisi: ")
                bulan = input("Masukkan bulan: ")
                item = Magazine(item_id, judul, tahun, penerbit, edisi, bulan)
            
            elif tipe == "3":
                sutradara = input("Masukkan sutradara: ")
                durasi = int(input("Masukkan durasi (menit): "))
                item = DVD(item_id, judul, tahun, sutradara, durasi)
            
            else:
                print("Tipe tidak valid!")
                continue
            
            print(library.add_item(item))
        
        elif pilihan == "8":
            library.get_statistics()
        
        elif pilihan == "9":
            print(f"\nTerima kasih telah menggunakan {library.name}!")
            break
        
        else:
            print("\nPilihan tidak valid! Silakan coba lagi.")


if __name__ == "__main__":
    main()
