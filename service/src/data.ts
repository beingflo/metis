import type Elysia from "elysia";
import { t } from "elysia";
import { db } from "./db";

export const dataGroup = (app: Elysia<"/data">) =>
  app
    .get("/last", () => {
      const qry = db.query("SELECT * FROM data ORDER BY timestamp DESC;");
      const results = qry.all();

      return results;
    })
    .post(
      "/",
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
