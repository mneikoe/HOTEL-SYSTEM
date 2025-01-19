require("dotenv").config();
const mongoose = require("mongoose");

// Mapping of subdomains to database URLs
const dbConnections = {
  indiga: process.env.DB_URL_INDIGA, // Database URL for "indiga"
  kanha: process.env.DB_URL_KANHA, // Database URL for "kanha"
  amulyashri: process.env.DB_URL_AMULYASHRI, // Database URL for "amulyashri"
};

async function connectToDb(req) {
  try {
    // Extract subdomain from request headers (e.g., "indiga" from "indiga.atithikripa.com")
    const host = req.headers.host; // Example: "indiga.atithikripa.com"
    const subdomain = host.includes("www.")
      ? host.split(".")[1]
      : host.split(".")[0];

    // If the subdomain is 'www', you can handle it as an error or route it to a default subdomain
    if (subdomain === "www") {
      throw new Error("No valid subdomain found.");
    }

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
    console.error(`Connection to database for subdomain failed:`, err);
    throw err;
  }
}

module.exports = connectToDb;
