// File: db.js
// Description : Ce fichier est responsable de la création d'une connexion à la base de données MySQL en utilisant le package mysql2.

const mysql = require('mysql2');
require('dotenv').config();

// 🔸 Création de la connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_ADDR,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

module.exports = db;