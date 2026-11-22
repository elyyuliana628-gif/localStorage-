
// MENGAMBIL ELEMEN HTML
const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const bookForm = document.getElementById("bookForm");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookList = document.getElementById("bookList");

let books = JSON.parse(localStorage.getItem("books")) || [];
let editId = null;

// FITUR LOGIN
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (username === "admin" && password === "12345") {
        sessionStorage.setItem("login", username);
        showDashboard();
    } else {
        alert("Username atau password salah!");
    }
});

// MENAMPILKAN DASHBOARD
function showDashboard() {
    loginPage.style.display = "none";
    dashboard.style.display = "block";

    document.getElementById("userDisplay").textContent =
        sessionStorage.getItem("login");

    renderBooks();
}

// FITUR LOGOUT
logoutBtn.addEventListener("click", function() {
    sessionStorage.removeItem("login");

    dashboard.style.display = "none";
    loginPage.style.display = "flex";

    loginForm.reset();
});

// MENYIMPAN DATA KE LOCALSTORAGE
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// MENAMBAHKAN DAN MENGEDIT BUKU
bookForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = bookTitle.value.trim();
    const author = bookAuthor.value.trim();

    if (editId !== null) {
        const book = books.find(b => b.id === editId);

        book.title = title;
        book.author = author;

        editId = null;

        document.getElementById("submitBtn").textContent =
            "Tambah Buku";

    } else {
        books.push({
            id: Date.now(),
            title: title,
            author: author,
            read: false
        });
    }

    saveBooks();
    renderBooks();
    bookForm.reset();
});

// MENAMPILKAN DAFTAR BUKU
function renderBooks() {
    bookList.textContent = "";

    const keyword =
        document.getElementById("searchBook").value.toLowerCase();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(keyword)
    );

    if (filteredBooks.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "Buku tidak ditemukan.";
        bookList.appendChild(empty);
    }

    filteredBooks.forEach(function(book) {
        const item = document.createElement("div");
        item.className = "book-item";

        if (book.read) {
            item.classList.add("read");
        }

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = "Penulis: " + book.author;

        const status = document.createElement("p");
        status.textContent = book.read
            ? "Status: Sudah dibaca"
            : "Status: Belum dibaca";

        details.append(title, author, status);

        const actions = document.createElement("div");
        actions.className = "actions";

        // TOMBOL BACA
        const readBtn = document.createElement("button");
        readBtn.className = "read-btn";
        readBtn.textContent = book.read ? "Belum" : "Selesai";

        readBtn.addEventListener("click", function() {
            book.read = !book.read;
            saveBooks();
            renderBooks();
        });

        // TOMBOL EDIT
        const editBtn = document.createElement("button");
        editBtn.className = "edit";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            bookTitle.value = book.title;
            bookAuthor.value = book.author;
            editId = book.id;

            document.getElementById("submitBtn").textContent =
                "Simpan Perubahan";
        });

        // TOMBOL HAPUS
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "Hapus";

        deleteBtn.addEventListener("click", function() {
            if (confirm("Yakin ingin menghapus buku ini?")) {
                books = books.filter(b => b.id !== book.id);

                saveBooks();
                renderBooks();
            }
        });

        actions.append(readBtn, editBtn, deleteBtn);
        item.append(details, actions);

        bookList.appendChild(item);
    });

    // MENGHITUNG JUMLAH BUKU
    document.getElementById("totalBooks").textContent =
        books.length;

    document.getElementById("readBooks").textContent =
        books.filter(b => b.read).length;
}

// FITUR PENCARIAN BUKU
document.getElementById("searchBook")
    .addEventListener("input", renderBooks);

// MEMERIKSA STATUS LOGIN
if (sessionStorage.getItem("login")) {
    showDashboard();
                                               }
