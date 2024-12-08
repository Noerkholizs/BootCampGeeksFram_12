// notFound.js
const path = require("path");

module.exports = function (req, res) {
  // Render 404 page when a route is not found
  res.status(404).render("404", {
    body: "<h1>404: Page Not Found</h1><h3>Oops! Halaman yang Anda cari tidak tersedia.</h3>",
  });
};
