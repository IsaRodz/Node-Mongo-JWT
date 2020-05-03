require("dotenv").config();

const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Mongo DB"));
