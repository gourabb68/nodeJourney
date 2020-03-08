const http =require('http');
const hostname = 'localhost';
const port = 3000;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');


const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(express.static(__dirname));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
const server = http.createServer(app);
server.listen(port,hostname,()=>{
    console.log(`server running on http://${hostname}:${port}`)
})


