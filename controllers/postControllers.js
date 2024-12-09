const fs = require("fs"); // Import modul 'fs' untuk operasi file
const validator = require("validator"); // Import modul 'validator' untuk validasi
const path = require("path"); // For handling file paths
const { validationResult } = require("express-validator");
const {
  readContacts,
  saveContacts,
  defaultTitle,
} = require("../services/contactService");
// Define paths for data storage
const dirPath = path.join(__dirname, "../data"); // Adjust the path to point to the "data" folder
const dataPath = path.join(dirPath, "contacts.json"); // Menyimpan path file contacts.json

// membuat folder data apabila tidak ada
// if (!fs.existsSync(dirPath)) {
//   fs.mkdirSync(dirPath);
// }

// // membuat file contacts.json apabila tidak ada
// if (!fs.existsSync(dataPath)) {
//   fs.writeFileSync(dataPath, "[]", "utf-8");
// }

// (READ) Fungsi untuk membaca data conatats dari file
// const readContacts = () => {
//   const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
//   return contacts;
// };

// // (SAVE) Fungsi untuk menyimpan contact
// // Higher-order function: takes `dataPath` and returns a new function
// const saveContacts = (dataPath, contacts) => {
//   fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
//   console.log("Data added successfully!");
// };

// @desc Update contacts
// @route GET /contact/contact
const getUpdateContact = (req, res) => {
  const { name, email, number } = req.query;
  res.render("updateContact", {
    oldData: {
      oldName: name,
      newName: name,
      newEmail: email,
      newNumber: number,
    },
  });
};

// @desc GET all contacts
// @route GET /contact
const getContacts = (req, res, next) => {
  try {
    const contacts = readContacts();
    if (!contacts) {
      throw new Error("Contacts data is missing");
    }

    return res.render("contact", {
      defaultTitle,
      contacts,
    });
  } catch (error) {
    console.error("Error reading or parsing contacts.json:", error);
    res.status(500).send("Internal Server Error");
  }
};

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

// @desc Membuat contact baru
// @route POST /contact
const createContact = (req, res) => {
  try {
    // Cek hasil validasi
    const errors = validationResult(req);

    // Baca data kontak saat ini
    const contacts = readContacts();

    if (!errors.isEmpty()) {
      // Kirim ulang form jika validasi gagal, sertakan input sebelumnya
      const alert = errors.array();
      return res.render("contact", {
        alert,
        contacts,
        oldData: req.body, // Mengirim data sebelumnya ke template
        defaultTitle,
      });
    }

    // Membuat objek kontak baru
    const newContact = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
    };

    // Tambahkan kontak baru ke array
    contacts.push(newContact);

    // Simpan kontak ke file JSON
    saveContacts(contacts);

    // Redirect ke halaman kontak
    return res.redirect("/contact");
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).send("Internal Server Error");
  }
};

// @desc Update contact
// @route POST /contact
const updateContact = (req, res) => {
  try {
    console.log("passed");
    // Cek hasil validasi
    const errors = validationResult(req);

    // Baca data kontak saat ini
    const contacts = readContacts();

    if (!errors.isEmpty()) {
      // Kirim ulang form jika validasi gagal, sertakan input sebelumnya
      const alert = errors.array();
      return res.render("updateContact", {
        alert,
        contacts,
        oldData: req.body, // Mengirim data sebelumnya ke template
        defaultTitle,
      });
    }
    // const newContact = {
    //   name: req.body.newName,
    //   email: req.body.newEmail,
    //   number: req.body.newNumber,
    // };

    const { oldName, newName, newEmail, newNumber } = req.body;
    // Logika update
    const updateContact = contacts.map((contact) =>
      contact.name === oldName
        ? { name: newName, email: newEmail, number: newNumber }
        : contact
    );

    console.log(updateContact);

    saveContacts(updateContact);
    res.redirect("/contact");
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).send("Internal Server Error");
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

    saveContacts(updatedContacts); // Save updated contacts
    return res.redirect("/contact"); // Send the response
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
  detailContact,
  createContact,
  updateContact,
  deleteContact,
  getUpdateContact,
  readContacts,
  saveContacts,
  // rl,
};
