import type Elysia from "elysia";
import { t } from "elysia";
import { db } from "./db";

export const dataGroup = (app: Elysia<"">) =>
  app
    .get("/data", () => {
      const qry = db.query(
        "SELECT * FROM data ORDER BY timestamp DESC LIMIT 100;"
      );
      const results = qry.all();

      return results;
    })
    .post(
      "/data",
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
    );
