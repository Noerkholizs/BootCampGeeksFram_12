const express = require("express");
const app = express();
const port = 3000;
const dataPath = "./data/contacts.json"; // Menyimpan path file contacts.json
const func = require("./src/func");
const fs = require("fs");
const expressLayouts = require("express-ejs-layouts");
const { log } = require("console");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse form data

// const path = require("path");
// app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.use(express.static("public")); // Untuk file statis seperti CSS

app.use(expressLayouts);
app.set("layout", "layout/main");

// Middleware untuk variabel global (bisa digunakan di semua view)
app.use((req, res, next) => {
  res.locals.siteName = "My Website"; // Nama situs global
  next();
});

//-------------------------------------------------------------------------------------------------------

// HOME PAGE
app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
    headerTitle: "Selamat Datang di Home",
    metaDescription: "Halaman utama website kami",
  });
});

//ABOUT PAGE
app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About Us",
    headerTitle: "Tentang Kami",
    metaDescription: "Pelajari lebih lanjut tentang kami di halaman ini",
  });
});

//GET ALL CONTACTS
app.get("/contact", (req, res) => {
  try {
    const contacts = func.readContact();

    res.render("contact", {
      contacts,
      pageTitle: "Contact Us",
      headerTitle: "Kontak Kami",
      metaDescription: "Hubungi kami melalui informasi berikut",
    });
  } catch (error) {
    console.error("Error reading or parsing contacts.json:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST NEW CONTACT
app.post("/contact", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const newContact = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
    };
    data.push(newContact);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); // Save to file
    res.redirect("/contact"); // Redirect to the contact page
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).send("Internal Server Error");
  }
});

//DELETE CONTACT
app.post("/contact/delete", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const updatedData = data.filter(
      (contact) => contact.name !== req.body.name
    );
    fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2)); // Save to file
    res.redirect("/contact");
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use((req, res) => {
  res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// console.log("Views folder path:", app.get("views"));
// console.log("Public folder path:", path.join(__dirname, "public"));
