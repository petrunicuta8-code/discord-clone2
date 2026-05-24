const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "HOSTUL_TAU",
    user: "USERUL_TAU",
    password: "PAROLA_TA",
    database: "DATABASE_TA",
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
