const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna
const validator = require("validator"); // Import modul 'validator' untuk validasi
const fs = require("fs"); // Import modul 'fs' untuk operasi file
const { argv } = require("process");
const { log } = require("console");
const dirPath = "./data"; // Menyimpan path direktori data
const dataPath = "./data/contacts.json"; // Menyimpan path file contacts.json

// Membuat antarmuka readline untuk membaca input dari stdin dan menulis output ke stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//membuat folder data apabila tidak ada
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file contacts.json apabila tidak ada
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const question = (questions) => {
  return new Promise((resolve, rejects) => {
    rl.question(questions, (input) => {
      resolve(input);
    });
  });
};

const readContact = () => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return contacts;
};

// Fungsi untuk menambahkan conctact (ADD)
const addContact = async (contact) => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // Membuat fungsi isDuplicate untuk memeriksa jika terjadi kesamaan sata/duplikasi
  // Menggunakan method array.some() untuk memeriksa kesamaan data
  const isDuplicate = contacts.some(
    (existingContact) =>
      existingContact.name.toLowerCase() === contact.name.toLowerCase()
  );

  if (isDuplicate) {
    console.log(`kontak dengan nama ${contact.name} sudah ada`);
    return;
    // Bagaimana pengunaa return?
  }

  contacts.push(contact);
  saveContacts(contacts);
};

// Fungsi untuk memperbaharui contact (UPDATE)
const updateContact = (oldName, newName, newEmail, newMobile) => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // Cari indeks kontak berdasarkan nama lama
  const contactIndex = contacts.findIndex(
    (contact) => contact.name.toLowerCase() === oldName.toLowerCase()
  );

  if (contactIndex === -1) {
    console.log(`Contact with name "${oldName}" not found.`);
    return;
  }

  // Validasi email dan mobile jika diupdate
  if (newEmail && !validator.isEmail(newEmail)) {
    console.log("Invalid email format.");
    return;
  }

  if (newMobile && !validator.isMobilePhone(newMobile, "any")) {
    console.log("Invalid mobile number format.");
    return;
  }

  // Update data kontak
  // Aku masih bingung, bagaimana ini bekerja
  contacts[contactIndex] = {
    name: newName || contacts[contactIndex].name,
    email: newEmail || contacts[contactIndex].email,
    mobile: newMobile || contacts[contactIndex].mobile,
  };

  saveContacts(contacts);
  console.log(`Contact "${oldName}" has been updated successfully.`);
};

// Fungsi untuk menyimpan contact (SAVE)
const saveContacts = (contacts) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts));
  console.log("data added successfully!");
};

// Fungsi untuk menghapus kontak (DELETE)
const deleteContact = (argv) => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const filteredContacts = contacts.filter(
    (contact) => contact.name !== argv.name
  );

  if (contacts.length === filteredContacts.length) {
    console.log(`Contact with name "${argv.name}" not found.`);
    return contacts;
  }
  saveContacts(filteredContacts);
  console.log(`Contact with name "${argv.name}" has been deleted.`);
};

// Fungsi untuk menunjukan detail dari setiap kontak (DETAIL)
const detailContact = (name) => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  if (name) {
    const contact = contacts.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    if (contact) {
      console.log(`Contact found:`);
      console.log(`Name: ${contact.name}`);
      console.log(`Email: ${contact.email}`);
      console.log(`Mobile: ${contact.mobile}`);
      console.log("-----------------------------");
    } else {
      console.log(`No contact found with the name "${name}".`);
    }
  }
};

// List Contact
const listContact = () => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  if (contacts.length === 0) {
    console.log("No contact found yoo");
    return contacts;
  }

  console.log("List of contact:");
  contacts.forEach((contact, index) => {
    console.log(`${index + 1}. ${contact.name} (${contact.mobile})`);
  });
};

// Export disini
module.exports = {
  question,
  addContact,
  deleteContact,
  detailContact,
  listContact,
  updateContact,
  readContact,
  rl,
};
