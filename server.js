const express = require("express"); // Framework untuk membangun server
const expressLayouts = require("express-ejs-layouts"); // Middleware untuk layout EJS
const posts = require("./routers/posts");
const bodyParser = require("body-parser"); // Middleware untuk mem-parsing data form
const errorHandler = require("./middleware/error");
const notFound = require("./middleware/notFound");
// const fs = require("fs"); // Modul bawaan Node.js untuk bekerja dengan sistem file
// const path = require("path"); // Modul bawaan Node.js untuk bekerja dengan path
// const func = require("./src/func"); // Modul kustom (berisi fungsi-fungsi yang Anda buat)
// const dataPath = "./data/contacts.json"; // Path untuk file kontak JSON

const app = express(); // Membuat instance dari express
const port = 3000; // Menentukan port untuk server

// Set view engine menjadi EJS
app.set("view engine", "ejs");
app.set("layout", "layout/main");
app.use(express.static("public")); // Untuk file statis seperti CSS
app.use(expressLayouts);

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware untuk variabel global (bisa digunakan di semua view)
app.use((req, res, next) => {
  res.locals.siteName = "My Website"; // Nama situs global
  res.locals.headerTitle = "Selamat Datang di Home";
  res.locals.pageTitle = "Selamat Datang di Home";
  res.locals.metaDescription = "Halaman utama website kami";
  next();
});

//Routes
app.use("/", posts);

app.use(errorHandler);
app.use(notFound);

// Middleware untuk menangani 404 error
// app.use((req, res) => {
//   res.status(404).send("404 : Page not found Broo!");
//   console.log("404 ERROR");
// });

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// console.log("Views folder path:", app.get("views"));
// console.log("Public folder path:", path.join(__dirname, "public"));
