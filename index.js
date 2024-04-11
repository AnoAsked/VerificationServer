require("./config/db");

const app = require('express')();
const nodemailer = require('nodemailer'); // For sending emails
const port = 3000;

const verificationRouter = require('./api/verification')

const bodyParser = require('express').json;
const cors = require('cors')
app.use(cors({
    origin: ['http://localhost:5173', 'https://anoasked-git-dev-simon-masooglus-projects.vercel.app', 'https://anoasked.vercel.app']
}));
app.use(bodyParser());
app.use('/verification', verificationRouter);

app.listen(port, () => console.log(`AnoAsked verification server running on port: ${port}`))