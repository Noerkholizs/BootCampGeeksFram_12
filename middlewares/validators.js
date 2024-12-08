const { body } = require("express-validator");
const { isNameExists } = require("../services/contactService");

const validateContact = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("The name must be at least 3 characters long")
    .custom((newName, { req }) => {
      // Only check if the name has changed (not the same as oldName)
      if (newName !== req.body.oldName && isNameExists(newName)) {
        throw new Error(`Contact with name "${newName}" already exists`);
      }
      return true;
    }),
  body("email").isEmail().normalizeEmail().withMessage("Email is invalid"),
  body("number").isNumeric().withMessage("Number should be numeric"),
];

module.exports = { validateContact };
