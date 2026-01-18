// const { render } = require("ejs");

const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

/* ---------- RENDER BOARD ---------- */
const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const squareElement = document.createElement("div");

            squareElement.classList.add(
                "square",
                (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = colIndex;

            /* ---------- PIECE ---------- */
            if (square) {
                const pieceElement = document.createElement("div");

                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );

                pieceElement.innerText = getPieceUnicode(square);

                // Allow dragging only if player owns the piece
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (!pieceElement.draggable) return;

                    draggedPiece = pieceElement;
                    sourceSquare = { row: rowIndex, col: colIndex };
                    e.dataTransfer.setData("text/plain", "");
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            /* ---------- DROP EVENTS ---------- */
            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!draggedPiece || !sourceSquare) return;

                const targetSquare = {
                    row: Number(squareElement.dataset.row),
                    col: Number(squareElement.dataset.col),
                };

                handleMove(sourceSquare, targetSquare);
            });

            boardElement.appendChild(squareElement);
        });
    });
};

/* ---------- HANDLE MOVE ---------- */
const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q", // auto promote to queen
    };

    socket.emit("move", move);
};

/* ---------- UNICODE PIECES ---------- */
const getPieceUnicode = (piece) => {
    const unicodePieces = {
        w: {
            p: "♙",
            r: "♖",
            n: "♘",
            b: "♗",
            q: "♕",
            k: "♔",
        },
        b: {
            p: "♟",
            r: "♜",
            n: "♞",
            b: "♝",
            q: "♛",
            k: "♚",
        }
    };

    return unicodePieces[piece.color][piece.type];
};


/* ---------- SOCKET EVENTS ---------- */

// Assigned as white or black
socket.on("playerRole", (role) => {
    playerRole = role;
    renderBoard();
});

// Spectator
socket.on("spectatorRole", () => {
    playerRole = null;
    renderBoard();
});

// Sync board state
socket.on("boardState", (fen) => {
    chess.load(fen);
    renderBoard();
});

// Apply opponent move
socket.on("move", (move) => {
    chess.move(move);
    renderBoard();
});

// Initial render
renderBoard();
