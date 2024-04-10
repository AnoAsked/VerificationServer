require("./config/db");

const app = require('express')();
const nodemailer = require('nodemailer'); // For sending emails
const port = 3000;

const verificationRouter = require('./api/verification')

const bodyParser = require('express').json;
const cors = require('cors')
app.use(bodyParser());
app.use('/verification', verificationRouter);
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => console.log(`AnoAsked verification server running on port: ${port}`))