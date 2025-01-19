const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

// Mapping of exact subdomain URLs to database connections
const dbConnections = {
  "indiga.atithikripa.com": process.env.DB_URL_INDIGA, // Exact URL for "indiga"
  "kanha.atithikripa.com": process.env.DB_URL_KANHA, // Exact URL for "kanha"
  "amulyashri.atithikripa.com": process.env.DB_URL_AMULYASHRI, // Exact URL for "amulyashri"
};

async function connectToDb(req) {
  try {
    const host = req.headers.host; // Example: "indiga.atithikripa.com"

    const uri = dbConnections[host]; // Directly map the full domain to the db URL

    if (!uri) {
      throw new Error(`No database URL configured for subdomain: ${host}`);
    }

    // Connect to the database if not already connected
    if (!mongoose.connections.some((conn) => conn.readyState)) {
      await mongoose.connect(uri);
      console.log(`Connected successfully to database for subdomain: ${host}`);
    }
  } catch (err) {
    console.error(`Connection to database failed:`, err);
    throw err;
  }
}

module.exports = connectToDb;
