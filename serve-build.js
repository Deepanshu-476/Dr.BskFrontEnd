const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.join(__dirname, "build");
const port = process.env.PORT || 3001;

const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
};

http
  .createServer((req, res) => {
    const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(root, cleanUrl === "/" ? "index.html" : cleanUrl);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(root, "index.html");
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Serving build at http://127.0.0.1:${port}`);
  });
