const express = require("express");
const {
  getContacts,
  createContact,
  deleteContact,
  // detailContact,
  updateContact,
  readContacts,
  saveContacts,
  detailContact,
} = require("../controllers/postControllers");
const router = express.Router();

// HOME PAGE
router.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
    headerTitle: "Selamat Datang di Home",
    metaDescription: "Halaman utama website kami",
  });
});

//ABOUT PAGE
router.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About Us",
    headerTitle: "Tentang Kami",
    metaDescription: "Pelajari lebih lanjut tentang kami di halaman ini",
  });
});

// Get all contacts
router.get("/contact", getContacts);

// Get single contact
router.get("contact/:name", detailContact);

// Create new contact
router.post("/contact", createContact);

// Update contact
router.post("/contact/update", updateContact);

// Delete contact
router.post("/contact/delete", deleteContact);

module.exports = router;
