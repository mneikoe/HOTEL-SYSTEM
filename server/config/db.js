// db.js
const mongoose = require("mongoose");

//const uri = "mongodb://127.0.0.1:4000";
const uri =
  "mongodb+srv://raj117557:oIOD5FtqeDSxGcik@cluster0.ny5io.mongodb.net/";

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
