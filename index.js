const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const http = require("http");
const fs = require("fs");
const path = require("path");
const ps = require("ps-node");
const app = express();
const port = 3000;
const portToKill = 35729;

// Create a livereload server
const livereloadServer = livereload.createServer({
  port: 35729,
  exts: ["html", "css"], // Specify the file extensions to watch
});
livereloadServer.watch(__dirname);

// Middleware to inject livereload script into HTML files
app.use(connectLivereload());

// Serve static files from "public" directory
app.use(express.static("public"));

// Start Express server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Create HTTP server to serve HTML and CSS
const httpServer = http.createServer((request, response) => {
  if (request.url === "/") {
    fs.readFile("./index.html", "utf8", (err, html) => {
      if (err) {
        response.writeHead(500);
        response.end("Internal Server Error");
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(html);
      }
    });
  } else if (request.url === "/public/style.css") {
    const cssPath = path.join(__dirname, "public", "style.css");
    fs.readFile(cssPath, "utf8", (err, css) => {
      if (err) {
        response.writeHead(500);
        response.end("Internal Server Error");
      } else {
        response.writeHead(200, { "Content-Type": "text/css" });
        response.end(css);
      }
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});

httpServer.listen(8000);

// Handle nodemon's restart event
process.once("SIGUSR2", () => {

  server.close(() => {
    livereloadServer.server.close();
    process.kill(process.pid, "SIGUSR2");
  });
});

// Handle process termination
process.on("SIGINT", () => {
  ps.lookup({ port: portToKill }, (err, resultList) => {
    if (err) {
      throw err;
    }
    resultList.forEach((process) => {
      if (process) {
        console.log(`Killing process with PID: ${process.pid}`);
        process.kill();
      }
    });
  });
  server.close(() => {
    livereloadServer.server.close();
    process.exit(0);
  });
});
