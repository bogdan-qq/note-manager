const path = require("path");

const rootDir = path.resolve(__dirname, "../../..");

module.exports = {
  rootDir,
  port: Number(process.env.PORT || 3000),
  databaseFilePath: path.join(rootDir, "database", "note-manager.sqlite"),
  schemaFilePath: path.join(rootDir, "database", "schema.sql"),
  seedFilePath: path.join(rootDir, "database", "seed.sql"),
  tokenSecret: process.env.TOKEN_SECRET || "note-manager-demo-secret",
};
