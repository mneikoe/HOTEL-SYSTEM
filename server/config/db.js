// db.js
require("dotenv").config();
const mongoose = require("mongoose");

<<<<<<< HEAD
// Ensure DB_URL is provided in .env file
const uri = process.env.DB_URL;

if (!uri) {
  console.error("Database URL (DB_URL) is not defined in the .env file.");
  process.exit(1); // Exit the process if the DB_URL is missing
}

function connectToDb() {
  // Set up connection retry mechanism to handle potential issues
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected successfully to the database");
    })
    .catch((err) => {
      console.error("Error connecting to the database", err);
      process.exit(1); // Exit the process if the connection fails
    });
=======
const uri = process.env.DB_URL;

function connectToDb() {
  try {
    mongoose.connect(uri);
    console.log("Connected successfully to database");
  } catch (err) {
    console.error("Connection to database failed", err);
    throw err;
  }
>>>>>>> parent of ba7152a (three subdomains configuration)
}

module.exports = connectToDb;
