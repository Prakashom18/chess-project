const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const app = express();

app.listen(3000,(err)=>{
    console.log("Running on port 3000");
})