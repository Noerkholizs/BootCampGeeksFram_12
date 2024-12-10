const fs = require("fs");
const path = require("path");
const pool = require("../data/dbDataContact");

// Path ke file JSON tempat menyimpan kontak
const dataPath = path.join(__dirname, "../data/contacts.json");

// Render default to ejs
function defaultTitle() {
  return {
    pageTitle: "Data Contacts",
    headerTitle: "Call this contact 🤫",
    metaDescription: " Hubungi kami melalui informasi berikut",
  };
}

// Membaca kontak dari database
const readContacts = async () => {
  try {
    const result = await pool.query("SELECT * FROM data_contact");
    return result.rows; // why this is neeed rows
  } catch (err) {
    console.error("Error reading contacts from database:", err);
    throw new Error("Error reading contacts from database");
  }
  // Bisa juga seperti ini
  // const result = await pool.query("SELECT * FROM data_contact")
  // return result.rows
};

// Membaca satu kontak dari databse
const readSingleContact = async (id) => {
  return (result = await pool.query(
    "SELECT * FROM data_contact where id = $1",
    [id]
  ));
};

// Menyimpan kontak ke database
const saveContacts = async (name, number, email) => {
  const result = await pool.query(
    "INSERT INTO data_contact (name, number, email) VALUES ($1, $2, $3) RETURNING *",
    [name, number, email]
  );

  console.log(result.rows[0]);
  // return result.rows[0]; // Return the inserted contact
};

// Mengecek apakah nama sudah ada
const isNameExists = async (name) => {
  try {
    const result = await pool.query(
      "SELECT 1 FROM data_contact WHERE name =  $1",
      [name]
    );
    return result.rowCount > 0;
  } catch (err) {
    console.error(
      "Error checking if name exists in the database:",
      err.message
    );
  }
};

// Mengecek apakah email sudah ada
const isEmailExists = async (email) => {
  try {
    const result = await pool.query(
      "SELECT 1 FROM data_contact WHERE email = $1",
      [email]
    );

    // If the query returns any rows, the email exists
    return result.rowCount > 0;
  } catch (err) {
    console.error(
      "Error checking if email exists in the database:",
      err.message
    );
    throw err; // Rethrow the error to handle it in the calling function
  }
};

function isNumberExists(number) {
  const contacts = readContacts();
  return contacts.some((contact) => contact.number === number);
}

module.exports = {
  readContacts,
  saveContacts,
  readSingleContact,
  isNameExists,
  isEmailExists,
  isNumberExists,
  defaultTitle,
};
