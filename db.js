const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "mysql-joi.railway.internal",
    user: "root",
    password: "EBXBxycekhqfMZjwMOWpVslWKZcwHWyR",
    database: "railway",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log("DB ERROR:", err);
    } else {
        console.log("🔥 DB CONNECTED");
    }
});

module.exports = db;
