import { Elysia, t } from "elysia";
import { Database } from "bun:sqlite";

const db = new Database("./db/db.sqlite");

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

new Elysia()
  .get("/data", () => {
    const qry = db.query("SELECT * FROM data LIMIT 10;");
    const results = qry.all();

    return results;
  })
  .post(
    "/push",
    ({ body }) => {
      const query = db.query(
        "INSERT INTO data (timestamp, data) VALUES ($timestamp, $data)"
      );

      query.run({
        $timestamp: body.timestamp ?? new Date().toISOString(),
        $data: JSON.stringify(body.data),
      });

      return 200;
    },
    {
      body: t.Object({
        data: t.Any(),
        timestamp: t.Optional(t.String({ format: "date-time" })),
      }),
    }
  )
  .post("/push/gps", ({ body }: { body: any }) => {
    const query = db.query(
      "INSERT INTO data (timestamp, data) VALUES ($timestamp, $data)"
    );

    body.locations.forEach((loc: any) => {
      query.run({
        $timestamp: new Date(loc.properties.timestamp).toISOString(),
        $data: JSON.stringify(loc),
      });
    });

    return {
      result: "ok",
    };
  })
  .listen(3007);

console.log("Metis stated listening on port 3007!");
