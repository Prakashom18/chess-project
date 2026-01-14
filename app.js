const express = require('express');
const http = require('http');
const socket = require('socket.io');
const {Chess} = require('chess.js')
const path = require('path');

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    res.render('index',{title:"Chess Game"});
})

io.on("connection",function(uniquesocket){
    console.log("Connected");

    uniquesocket.on("disconnect",function(){
        console.log("Disconnected");
    })    
    // uniquesocket.on("churan",function(){
    //     console.log("churan recieved");
    //     io.emit("churan papdi")
    // })
});


server.listen(3000,(err)=>{
    console.log("Running on port 3000");
})