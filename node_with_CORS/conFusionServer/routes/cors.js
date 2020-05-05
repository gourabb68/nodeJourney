const express = require('express');
const cors = require('cors');
const app = express();

//addig accepted url
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
// if you configure the cors Module by simply saying cors without any options, then that means this will reply back with access control allowOrigin with the wild cards toll. There are certain rules on which this is acceptable to do,
exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);