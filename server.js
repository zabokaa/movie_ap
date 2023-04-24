const http = require("http");

http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello Node!\n");
}).listen(5500);

console.log("My first Node test server is running on Port 5500.");