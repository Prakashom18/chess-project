const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const chess = new Chess();
let players = {};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" });
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Assign roles
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "b");
    } else {
        socket.emit("spectatorRole");
    }

    socket.emit("boardState", chess.fen());

    socket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && socket.id !== players.white) return;
            if (chess.turn() === "b" && socket.id !== players.black) return;

            const result = chess.move(move);

            if (result) {
                io.emit("move", result);
                io.emit("boardState", chess.fen());
            } else {
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.error(err);
            socket.emit("invalidMove", move);
        }
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);

        if (socket.id === players.white) delete players.white;
        if (socket.id === players.black) delete players.black;
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
