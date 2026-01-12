const express = require('express');
const http = require('http');
const {Chess} = require('chess.js')

const app = express();
const server = http.createServer(app);
const io = socket(server);


app.listen(3000,(err)=>{
    console.log("Running on port 3000");
})