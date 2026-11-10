// Servidor local opcional, sin dependencias. Ejecutar: node server.js
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const archivos = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/js/app.js": ["js/app.js", "text/javascript; charset=utf-8"],
  "/css/bootstrap.min.css": ["css/bootstrap.min.css", "text/css; charset=utf-8"]
};
http.createServer((req, res) => {
  const archivo = archivos[new URL(req.url, "http://localhost").pathname];
  if (!archivo) { res.writeHead(404); res.end("No encontrado"); return; }
  fs.readFile(path.join(__dirname, archivo[0]), (error, contenido) => {
    if (error) { res.writeHead(500); res.end("No se pudo leer el archivo"); return; }
    res.writeHead(200, { "Content-Type": archivo[1] });
    res.end(contenido);
  });
}).listen(5500, "127.0.0.1", () => console.log("Explorador: http://127.0.0.1:5500"));
