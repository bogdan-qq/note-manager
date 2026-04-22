const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const env = require("../config/env");

let SQL;
let db;

function ensureDirectoryExists(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readSql(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function runSqlStatements(sqlText) {
  const statements = sqlText
    .split(/;\s*\n/g)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    db.run(statement);
  }
}

function persistDatabase() {
  ensureDirectoryExists(env.databaseFilePath);
  const exportedDatabase = db.export();
  fs.writeFileSync(env.databaseFilePath, Buffer.from(exportedDatabase));
}

async function initializeDatabase({ forceReset = false } = {}) {
  SQL = await initSqlJs({
    locateFile: (file) => path.join(env.rootDir, "node_modules", "sql.js", "dist", file),
  });

  ensureDirectoryExists(env.databaseFilePath);

  if (!forceReset && fs.existsSync(env.databaseFilePath)) {
    const fileBuffer = fs.readFileSync(env.databaseFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    runSqlStatements(readSql(env.schemaFilePath));
    runSqlStatements(readSql(env.seedFilePath));
    persistDatabase();
  }

  db.run("PRAGMA foreign_keys = ON;");
  return db;
}

function getDatabase() {
  if (!db) {
    throw new Error("Database is not initialized.");
  }
  return db;
}

function query(sql, params = []) {
  const statement = getDatabase().prepare(sql, params);
  const rows = [];

  while (statement.step()) {
    rows.push(statement.getAsObject());
  }

  statement.free();
  return rows;
}

function queryOne(sql, params = []) {
  return query(sql, params)[0] || null;
}

function execute(sql, params = []) {
  getDatabase().run(sql, params);
  persistDatabase();
}

module.exports = {
  execute,
  initializeDatabase,
  persistDatabase,
  query,
  queryOne,
};
