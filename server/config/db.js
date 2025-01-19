require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.DB_URL;

function connectToDb() {
  try {
    mongoose.connect(uri);
    console.log("Connected successfully to database");
  } catch (err) {
    console.error("Connection to database failed", err);
    throw err;
  }
}

module.exports = connectToDb;
