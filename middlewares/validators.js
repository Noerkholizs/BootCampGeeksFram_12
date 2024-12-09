const { body } = require("express-validator");
const {
  isNameExists,
  isEmailExists,
  isNumberExists,
} = require("../services/contactService");

const validateContact = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("The name must be at least 3 characters long")
    .isString()
    .toLowerCase()
    .custom(async (newName, { req }) => {
      // Only check if the name has changed (not the same as oldName)
      if (await isNameExists(newName)) {
        throw new Error(`Contact with name "${newName}" already exists`);
      }
      return true;
    }),
  body("email")
    .isEmail()
    .withMessage("Email is invalid")
    .custom(async (newEmail, { req }) => {
      console.log(newEmail);
      if (!newEmail) {
        throw new Error(`Email is required`);
      } else if (await isEmailExists(newEmail)) {
        throw new Error(`"${newEmail}" is already exist`);
      }
      return true;
    }),
  body("number", "Mobile phone is invalid").isMobilePhone("id-ID"),
];

module.exports = { validateContact };
