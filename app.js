const { name } = require("ejs");
const express = require("express");
const app = express();
const port = 3000;
const dataPath = "./data/contacts.json"; // Menyimpan path file contacts.json
const func = require("./src/func");
const fs = require("fs");
const { title } = require("process");
const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("layout", "layout/main");

app.set("view engine", "ejs");
app.use(express.static("public")); // Untuk file statis seperti CSS

// Middleware untuk variabel global (bisa digunakan di semua view)
app.use((req, res, next) => {
  res.locals.siteName = "My Website"; // Nama situs global
  next();
});

// Fungsi untuk membaca file JSON
const readContacts = () => {
  try {
    const data = fs.readFileSync("./data/contacts.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts.json:", error);
    return []; // Jika error, kembalikan array kosong
  }
};

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
    headerTitle: "Selamat Datang di Home",
    metaDescription: "Halaman utama website kami",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About Us",
    headerTitle: "Tentang Kami",
    metaDescription: "Pelajari lebih lanjut tentang kami di halaman ini",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    pageTitle: "Contact Us",
    headerTitle: "Kontak Kami",
    metaDescription: "Hubungi kami melalui informasi berikut",
    contacts: readContacts(),
  });
});

app.use((req, res) => {
  res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

console.log("Views folder path:", app.get("layout"));
