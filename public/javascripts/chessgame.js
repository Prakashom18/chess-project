const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// socket.emit("churan");
// socket.on("churan papdi",function(){
//     console.log("churan papdi recieved"); 
// });