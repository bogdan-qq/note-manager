const env = require("./config/env");
const { initializeDatabase } = require("./database/client");
const app = require("./app");

async function start() {
  try {
    await initializeDatabase();

    app.listen(env.port, () => {
      console.log(`NoteManager server is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start the server.");
    console.error(error);
    process.exit(1);
  }
}

start();
