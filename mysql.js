const Sequelize = require('sequelize');

const database = "delilah-resto";
const user = "root";
const host = "localhost";
const password = "";
const port = "";

const sequelize = new Sequelize(`mysql://${user}:${password}@${host}:${port}/${database}`);
module.exports = sequelize;