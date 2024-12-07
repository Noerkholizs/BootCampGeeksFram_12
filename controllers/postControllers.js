const fs = require("fs"); // Import modul 'fs' untuk operasi file
const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna
const validator = require("validator"); // Import modul 'validator' untuk validasi
const path = require("path"); // For handling file paths
const express = require("express");
const router = express.Router(); // Create a router instance

// Define paths for data storage
const dirPath = path.join(__dirname, "../data"); // Adjust the path to point to the "data" folder
const dataPath = path.join(dirPath, "contacts.json"); // Menyimpan path file contacts.json

// membuat folder data apabila tidak ada
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file contacts.json apabila tidak ada
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Add middleware to parse JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.set("views", path.join(__dirname, "views"));

// app.set("view engine", "ejs");
// app.use(express.static("public"));

// Membuat antarmuka readline untuk membaca input dari stdin dan menulis output ke stdout
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const question = (questions) => {
//   return new Promise((resolve, rejects) => {
//     rl.question(questions, (input) => {
//       resolve(input);
//     });
//   });
// };

// (READ) Fungsi untuk membaca data conatats dari file
const readContacts = () => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return contacts;
};

// (SAVE) Fungsi untuk menyimpan contact
// Higher-order function: takes `dataPath` and returns a new function
const saveContacts = (dataPath, contacts, res) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
  console.log("Data added successfully!");
  res.redirect("/contact");
};

// @desc GET all contacts
// @route GET /contact
const getContacts = (req, res, next) => {
  try {
    const contacts = readContacts();

    return res.render("contact", {
      contacts,
      pageTitle: "Data Contacts",
      headerTitle: "Call this contact 🤫",
      metaDescription: "Hubungi kami melalui informasi berikut",
    });
  } catch (error) {
    console.error("Error reading or parsing contacts.json:", error);
    res.status(500).send("Internal Server Error");
  }
};

// @desc Membuat contact baru
// @route POST /contact
const createContact = (req, res, next) => {
  try {
    const contacts = readContacts(); //Membaca file contacts.json

    // Validasi input
    if (!req.body.name || !req.body.email || !req.body.number) {
      return res
        .status(400)
        .send("All fields (name, email, number) are required.");
    }

    // Membuat objek yang baru
    const newContact = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
    };

    // Membuat nameValidaor untuk memeriksa jika terjadi kesamaan data/duplikasi
    // Menggunakan method array.some() untuk memeriksa kesamaan data
    const nameValidator = contacts.some(
      (existingContact) =>
        existingContact.name.toLowerCase() === newContact.name.toLowerCase()
    );

    if (nameValidator) {
      return res.redirect("/contact");
      // return res.render("contact", {
      //   message: `Kontak dengan nama ${newContact.name} sudah ada`,
      //   pageTitle: "Data Contacts",
      //   headerTitle: "Call this contact 🤫",
      //   metaDescription: "Hubungi kami melalui informasi berikut",
      // });

      // return res
      //   .status(400)
      //   .json({ message: `Kontak dengan nama ${newContact.name} sudah ada` });

      // return res.send(`Kontak dengan nama ${newContact.name} sudah ada`);
      // Bagaimana pengunaa return?
    }

    // Add the new contact to the array
    contacts.push(newContact);

    // Save updated contacts to the file
    saveContacts(dataPath, contacts, res); // Use `saveContacts` here
    // return res.render("contact", { message: null });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).send("Internal Server Error");
  }
};

// @desc GET detail contact
// @route GET /contact
// @desc GET detail contact
// @route GET /contact/:name
const detailContact = (req, res, next) => {
  try {
    const contacts = readContacts(); // Read the existing contacts
    const contactName = req.params.name; // Extract the contact name from the URL parameter

    // Find the contact with the specified name (case-insensitive)
    const contact = contacts.find(
      (contact) => contact.name.toLowerCase() === contactName.toLowerCase()
    );

    if (!contact) {
      // If the contact is not found, respond with a 404 status and a message
      return res
        .status(404)
        .send(`Contact with name "${contactName}" not found.`);
    }

    // Render the details page for the contact (or respond with JSON if no view exists)
    return res.render("contactDetail", {
      contact,
      pageTitle: `Details for ${contact.name}`,
      headerTitle: "Contact Details",
      metaDescription: "Detail informasi kontak",
    });
  } catch (error) {
    console.error("Error fetching contact details:", error);
    next(error); // Pass error to Express's error-handling middleware
  }
};

// @desc Update contact
// @route PUT /contact
const updateContact = (req, res, next) => {
  try {
    const bacaContact = readContacts(); // Panggil fungsi untuk membaca kontak
    const { oldName, newName, newEmail, newNumber } = req.body;

    // Validasi input
    if (newEmail && !validator.isEmail(newEmail)) {
      return res.status(400).send("Invalid email format.");
    }
    if (newNumber && !validator.isMobilePhone(newNumber, "any")) {
      return res.status(400).send("Invalid mobile number format.");
    }

    // Logika update
    const contacts = bacaContact.map((contact) =>
      contact.name === oldName
        ? { name: newName, email: newEmail, number: newNumber }
        : contact
    );

    saveContacts(dataPath, contacts, res); // Simpan kontak yang sudah diperbarui
    console.log("sudah terupdate");
  } catch (err) {
    next(err); // Tangani error
  }
};

// @desc Delete contact
// @route DELETE /contact/delete
const deleteContact = (req, res, next) => {
  try {
    const contacts = readContacts(); // Fix variable name conflict
    const updatedContacts = contacts.filter(
      (contact) => contact.name !== req.body.name
    );

    if (contacts.length === updatedContacts.length) {
      return res.status(404).send("Contact not found.");
    }

    saveContacts(dataPath, updatedContacts, res); // Save updated contacts
  } catch (error) {
    console.error("Error deleting contact:", error);
    next(error); // Use next() to handle errors
  }
};

//  Fungsi untuk menghapus kontak (DELETE)
// const deleteContact = (argv) => {
//   const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
//   const filteredContacts = contacts.filter(
//     (contact) => contact.name !== argv.name
//   );

//   if (contacts.length === filteredContacts.length) {
//     console.log(`Contact with name "${argv.name}" not found.`);
//     return contacts;
//   }
//   saveContacts(filteredContacts);
//   console.log(`Contact with name "${argv.name}" has been deleted.`);
// };

// // Fungsi untuk menunjukan detail dari setiap kontak (DETAIL)
// const detailContact = (name) => {
//   const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

//   if (name) {
//     const contact = contacts.find(
//       (contact) => contact.name.toLowerCase() === name.toLowerCase()
//     );
//     if (contact) {
//       console.log(`Contact found:`);
//       console.log(`Name: ${contact.name}`);
//       console.log(`Email: ${contact.email}`);
//       console.log(`Mobile: ${contact.mobile}`);
//       console.log("-----------------------------");
//     } else {
//       console.log(`No contact found with the name "${name}".`);
//     }
//   }
// };

// // List Contact
// const listContact = () => {
//   const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
//   if (contacts.length === 0) {
//     console.log("No contact found yoo");
//     return contacts;
//   }

//   console.log("List of contact:");
//   contacts.forEach((contact, index) => {
//     console.log(`${index + 1}. ${contact.name} (${contact.mobile})`);
//   });
// };

//  disini
module.exports = {
  // question,
  getContacts,
  deleteContact,
  createContact,
  detailContact,
  // listContact,
  updateContact,
  readContacts,
  saveContacts,
  // rl,
};
