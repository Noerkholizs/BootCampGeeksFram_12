const fs = require("fs");
const path = require("path");

// Path ke file JSON tempat menyimpan kontak
const dataPath = path.join(__dirname, "../data/contacts.json");

// Render default to ejs
function defaultTitle() {
  return {
    pageTitle: "Data Contacts",
    headerTitle: "Call this contact 🤫",
    metaDescription: "Hubungi kami melalui informasi berikut",
  };
}

// Membaca kontak dari file JSON
function readContacts() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

// Menyimpan kontak ke file JSON
function saveContacts(contacts) {
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
  console.log("Data added successfully!");
}

// Mengecek apakah nama sudah ada
function isNameExists(name) {
  const contacts = readContacts();
  return contacts.some(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
}

module.exports = {
  readContacts,
  saveContacts,
  isNameExists,
  defaultTitle,
};
