const express = require("express");
const {
  getContacts,
  deleteContact,
  // detailContact,
  updateContact,
  getUpdateContact,
  // readContacts,
  // saveContacts,
  detailContact,
  createContact,
} = require("../controllers/postControllers");
const { validationResult } = require("express-validator");
const { validateContact } = require("../middlewares/validators");
const { readContacts, saveContacts } = require("../services/contactService");

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

// Get UpdateContact
router.get("/contact/update", getUpdateContact);

// Get all contacts
router.get("/contact", getContacts);

// Get detail contact
router.get("/contact/:name", detailContact);

// Create new contact
router.post("/contact", validateContact, createContact);

// Update contact
router.post("/contact/update", validateContact, updateContact);

// Delete contact
router.post("/contact/delete", deleteContact);

module.exports = router;
