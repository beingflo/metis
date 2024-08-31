import { Database } from "bun:sqlite";

export const db = new Database("./db/db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS data (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      timestamp TEXT NOT NULL,
      data TEXT NOT NULL
  );
`);

db.run(`CREATE INDEX IF NOT EXISTS ts_idx on data(timestamp);`);

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA synchronous = normal;");
