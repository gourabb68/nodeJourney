const express = require('express');
const bodyParser = require('body-parser');
const milk = express.Router();
milk.use(bodyParser.json());
milk.route('/:id')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('will send u');

}).post((req,res,next)=>{
    res.send('updated'+req.params.id);
})

milk.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('will send u');

}).post((req,res,next)=>{
    res.send('updated');
})

module.exports= milk;
