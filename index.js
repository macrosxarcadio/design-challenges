let http = require("http");
let fs = require("fs");
const path = require("path");
var livereload = require('livereload');
var server = livereload.createServer();

fs.readFile("./index.html", function (err, html) {
  if (err) {
    throw err;
  }
  server.watch(function (request, response) {
      if (request.url === "/") {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
      }
      if (request.url === "/css/style.css") {
        // Cargar y enviar el archivo CSS
        const cssPath = path.join(__dirname, "css", "style.css");
        fs.readFile(cssPath, function (err, css) {
          if (err) {
            response.writeHead(500);
            response.end("Error interno del servidor");
          } else {
            response.writeHead(200, { "Content-Type": "text/css" });
            response.write(css);
            response.end();
          }
        });
      }
    })
    .listen(8000);
});
