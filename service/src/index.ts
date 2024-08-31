import { Elysia, t } from "elysia";
import { db } from "./db";
import { getGPS, pushGPS } from "./gps";

new Elysia()
  .get("/data", () => {
    const qry = db.query(
      "SELECT * FROM data ORDER BY timestamp DESC LIMIT 100;"
    );
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
  .post("/push/gps", pushGPS)
  .get("/data/gps", getGPS)
  .listen(3007);

console.log("Metis stated listening on port 3007!");
