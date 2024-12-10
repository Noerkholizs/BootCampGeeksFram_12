const express = require("express");
const app = express();
const pool = require("./data/dbDataContact");
const port = 3000;

app.use(express.json());

// Membaca kontak dari file JSON
const readContacts = async () => {
  return (result = await pool.query("SELECT * FROM data_contact"));
  // Bisa juga seperti ini
  // const result = await pool.query("SELECT * FROM data_contact")
  // return result.rows
};

const readSingleContact = async (id) => {
  return (result = await pool.query(
    "SELECT * FROM data_contact where id = $1",
    [id]
  ));
};

// Menyimpan kontak ke file JSON
const saveContacts = async (name, mobile, email) => {
  const result = await pool.query(
    "INSERT INTO data_contact (name, mobile, email) VALUES ($1, $2, $3) RETURNING *",
    [name, mobile, email]
  );
  return result.rows[0]; // Return the inserted contact
};

app.get("/addasync", async (req, res) => {
  try {
    const name = "Noerkholis";
    const mobile = "085157447629";
    const email = "nkhmajid@gmail.com";
    const newContact = await saveContacts(name, mobile, email);
    res.json(newContact);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/readcontacts/:id", async (req, res) => {
  try {
    const newContact = await readContacts();
    res.json(newContact);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/singleContact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newContact = await readSingleContact(id);
    res.json(newContact);
  } catch (err) {
    console.error(err.message);
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
