const express = require("express");
const http = require("http");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { Server } = require("socket.io");

const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(express.static("public"));

app.use(session({
    secret: "topgsecret",
    resave: false,
    saveUninitialized: false
}));

/* ===== HOMEPAGE FIX (rezolvă Cannot GET /) ===== */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

/* ===== REGISTER ===== */
app.post("/register", async (req, res) => {

    try {
        const hash = await bcrypt.hash(req.body.password, 10);

        db.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [req.body.username, hash],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.json({ ok: false });
                }
                res.json({ ok: true });
            }
        );

    } catch (err) {
        console.log(err);
        res.json({ ok: false });
    }
});

/* ===== LOGIN ===== */
app.post("/login", (req, res) => {

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [req.body.username],
        async (err, result) => {

            if (err) {
                console.log(err);
                return res.json({ ok: false });
            }

            if (!result || result.length === 0) {
                return res.json({ ok: false });
            }

            const user = result[0];

            const match = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (match) {
                req.session.user = user.username;
                res.json({ ok: true, user: user.username });
            } else {
                res.json({ ok: false });
            }
        }
    );
});

/* ===== SOCKET CHAT ===== */
io.on("connection", (socket) => {

    console.log("User connected 🔥");

    socket.on("joinRoom", (room) => {
        socket.join(room);
    });

    socket.on("message", (data) => {

        if (!data.user || !data.text) return;

        db.query(
            "INSERT INTO messages (user, room, message) VALUES (?, ?, ?)",
            [data.user, data.room, data.text]
        );

        io.to(data.room).emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

/* ===== START SERVER ===== */
server.listen(3000, () => {
    console.log("🔥 DISCORD CLONE RUNNING: http://localhost:3000");
});