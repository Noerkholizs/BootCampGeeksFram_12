const express = require("express");
const app = express();
const port = 3000;
const dataPath = "./data/contacts.json"; // Menyimpan path file contacts.json
const func = require("./src/func"); // Import the factory function
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
      pageTitle: "Data Contacts",
      headerTitle: "Call this contact 🤫",
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
    // Read existing contacts
    const contacts = func.readContact();

    // Create a new contact object
    const newContact = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
    };

    // Add the new contact to the array
    contacts.push(newContact);

    // Save updated contacts to the file
    func.saveContacts(dataPath, contacts, res); // Use `saveContacts` here
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).send("Internal Server Error");
  }
});

//DELETE CONTACT
app.post("/contact/delete", (req, res) => {
  try {
    const readContact = func.readContact();
    const contacts = readContact.filter(
      (contact) => contact.name !== req.body.name
    );
    func.saveContacts(dataPath, contacts, res);
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).send("Internal Server Error");
  }
});

// UPDATE CONTACT
// masih belum megerti dengan if statemnet
app.post("/contact/update", (req, res) => {
  try {
    func.updateContact(req, res);
  } catch (error) {
    console.error("Error updating contact:", error);
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
