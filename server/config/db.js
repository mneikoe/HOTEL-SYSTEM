require("dotenv").config();
const mongoose = require("mongoose");

// Mapping of subdomains to database URLs
const dbConnections = {
  indiga: process.env.DB_URL_INDIGA, // Database URL for "indiga"
  kanha: process.env.DB_URL_KANHA,
  amulyashri: process.env.DB_URL_AMULYASHRI, // Database URL for "kanha"
};

async function connectToDb(subdomain) {
  try {
    const uri = dbConnections[subdomain];

    if (!uri) {
      throw new Error(`No database URL configured for subdomain: ${subdomain}`);
    }

    // Connect to the database if not already connected
    if (!mongoose.connections.some((conn) => conn.readyState)) {
      await mongoose.connect(uri);
      console.log(
        `Connected successfully to database for subdomain: ${subdomain}`
      );
    }
  } catch (err) {
    console.error(
      `Connection to database for subdomain ${subdomain} failed`,
      err
    );
    throw err;
  }
}

module.exports = connectToDb;
