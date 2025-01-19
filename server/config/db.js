const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

// Mapping of exact subdomain URLs to database connections
/*const dbConnections = {
  "indiga.atithikripa.com": process.env.DB_URL_INDIGA, // Exact URL for "indiga"
  "kanha.atithikripa.com": process.env.DB_URL_KANHA, // Exact URL for "kanha"
  "amulyashri.atithikripa.com": process.env.DB_URL_AMULYASHRI, // Exact URL for "amulyashri"
};*/

async function connectToDb(uri) {
  try {
    if (!mongoose.connections.some((conn) => conn.readyState)) {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`Connected successfully to database: ${uri}`);
    }
  } catch (err) {
    console.error("Connection failed", err);
    throw err;
  }
}

module.exports = connectToDb;
