const {Sequelize} = require('sequelize');

const db = new Sequelize("postgres://postgres:9bf9685d1f19408c9a3fe2763fcffc67@localhost:5432/animal-server");

module.exports = db;