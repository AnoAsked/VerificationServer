require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connection to MongoDB was successful.")
}).catch((err) => console.error(err))