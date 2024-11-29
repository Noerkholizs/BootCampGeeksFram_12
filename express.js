const { name } = require("ejs");
const express = require("express");
const app = express();
const port = 3000;
const dataPath = "./data/contacts.json"; // Menyimpan path file contacts.json
const func = require("./src/func");
const fs = require("fs");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  //res.sendFile(__dirname + "/views/index.html");
  const name = "Majid";
  res.render("index", { name });
});

app.get("/about", (req, res) => {
  //res.sendFile(__dirname + "/views/about.html");
  res.render("about");
});

app.get("/contact", (req, res) => {
  //res.sendFile(__dirname + "/views/contact.html");
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  res.render("contact", { contacts });
});

app.use((req, res) => {
  res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
