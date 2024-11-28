const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    const url = req.url;

    const renderHtml = (path, res) => {
      res.writeHead(200, { "content-type": "text/html" });
      fs.readFile(path, (err, data) => {
        if (err) {
          console.log(err);
          res.write("Error");
          res.end();
        } else {
          res.write(data);
          res.end();
        }
      });
    };

    if (url === "/about") {
      renderHtml("./views/about.html", res);
    } else if (url === "/contact") {
      renderHtml("./views/contact.html", res);
    } else if (url === "/") {
      renderHtml("./views/index.html", res);
    } else {
      res.write("Hello World");
    }
  })

  .listen(3000, () => {
    console.log("Server is running on port 3000");
  });
