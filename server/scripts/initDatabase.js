const { initializeDatabase } = require("../src/database/client");

initializeDatabase({ forceReset: true })
  .then(() => {
    console.log("Database was recreated successfully.");
  })
  .catch((error) => {
    console.error("Failed to initialize the database.");
    console.error(error);
    process.exit(1);
  });
