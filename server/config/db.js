// db.js
const mongoose = require("mongoose");

//const uri = "mongodb://127.0.0.1:4000";
const uri = "mongodb://0.0.0.0/HOTEL-SYSTEM";

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
