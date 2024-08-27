import { Elysia, t } from "elysia";
import { Database } from "bun:sqlite";

const db = new Database("./db/db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      timestamp TEXT NOT NULL,
      data TEXT NOT NULL
  );
`);

db.run(`CREATE INDEX IF NOT EXISTS ts_idx on metrics(timestamp);`);

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA synchronous = normal;");

new Elysia()
  .get("/", () => {
    const qry = db.query("SELECT * FROM metrics LIMIT 10;");
    const results = qry.all();

    return results;
  })
  .post(
    "/data",
    ({ body }) => {
      const query = db.query(
        "INSERT INTO metrics (timestamp, data) VALUES ($timestamp, $data)"
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
  .post(
    "/gps",
    ({ body }) => {
      const query = db.query(
        "INSERT INTO metrics (timestamp, data) VALUES ($timestamp, $data)"
      );

      body.locations.forEach((loc) => {
        query.run({
          $timestamp: new Date(loc.properties.timestamp).toISOString(),
          $data: JSON.stringify(loc),
        });
      });

      return 200;
    },
    {
      body: t.Object({
        locations: t.Array(
          t.Object({
            properties: t.Object({
              timestamp: t.String({ format: "date-time" }),
            }),
          })
        ),
      }),
    }
  )
  .listen(3000);

console.log("Metis stated listening on port 3000!");
