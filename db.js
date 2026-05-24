const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "kodama.proxy.rlwy.net",
    user: "root",
    password: "EBXBxycekhqfMZjwMOWpVslWKZcwHWyR",
    database: "railway",
    port: 10645
});

db.connect((err) => {
    if (err) {
        console.log("DB ERROR:", err);
    } else {
        console.log("🔥 DB CONNECTED");
    }
});

module.exports = db;
