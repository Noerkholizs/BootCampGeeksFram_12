const yargs = require("yargs");
const validator = require("validator");
const func = require("../src/func");

// ADD CONTACT
yargs.command({
  command: "add",
  describe: "add new contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
    mobile: {
      describe: "contact mobile",
      demandOption: true,
      type: "string",
    },
    email: {
      describe: "contact email",
      demandOption: false,
      type: "string",
    },
  },

  handler(argv) {
    const contact = {
      name: argv.name,
      mobile: argv.mobile,
      email: argv.email,
    };

    let isValid = true;
    let errorMessage = "";

    if (!validator.isMobilePhone(argv.mobile, "any")) {
      isValid = false;
      errorMessage += "Invalid mobile number. ";
    }

    if (argv.email && !validator.isEmail(argv.email)) {
      isValid = false;
      errorMessage += "Invalid email address. ";
    }

    if (isValid) {
      console.log(contact);
      func.addContact(contact);
    } else {
      console.log(errorMessage);
    }
  },
});

// UPDATE CONTACT
yargs.command({
  command: "update",
  describe: "update contact data",
  builder: {
    oldName: {
      describe: "existing contact name to update",
      demandOption: true,
      type: "string",
    },
    name: {
      describe: "new contact name",
      demandOption: false,
      type: "string",
    },
    email: {
      describe: "new contact email",
      demandOption: false,
      type: "string",
    },
    mobile: {
      describe: "new contact mobile",
      demandOption: false,
      type: "string",
    },
  },
  handler(argv) {
    func.updateContact(argv.oldName, argv.name, argv.email, argv.mobile);
  },
});

// DELETE CONTACT
yargs.command({
  command: "delete",
  describe: "delete contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
  },

  handler(argv) {
    func.deleteContact(argv);
  },
}),
  // DETAIL CONTACT
  yargs.command({
    command: "detail",
    describe: "detail contact by name",
    builder: {
      name: {
        describe: "contact name",
        demandOption: true,
        type: "string",
      },
    },

    handler(argv) {
      func.detailContact(argv.name); // Panggil fungsi showList dengan nama yang diteruskan dari argv
    },
  });

// LIST CONTACT
yargs.command({
  command: "list",
  describe: "list contact by name",

  handler() {
    func.listContact(); // Panggil fungsi showList dengan nama yang diteruskan dari argv
  },
});

yargs.parse();
