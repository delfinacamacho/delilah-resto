const express = require('express');
const server = express();
const port = 3000;
let date = new Date();
const bodyParser = require ('body-parser');

server.use(bodyParser.json());

server.listen(port, () => {
    console.log(`Servidor iniciado en puerto: ${port} - ${date}.`)
});

module.exports = server;