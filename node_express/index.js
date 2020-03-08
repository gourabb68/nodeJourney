const http = require('http');
const express = require('express');  
const hostname = 'localhost';
const port = 3005;
const morgan = require('morgan');


const app = express();
app.use(morgan('dev'));//creating middleware
app.use(express.static(__dirname));

app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});