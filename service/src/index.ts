import { Elysia, t } from "elysia";
import { db } from "./db";
import { getGPS, pushGPS } from "./gps";
import { dataGroup } from "./data";

new Elysia()
  .group("", dataGroup)
  .post("/push/gps", pushGPS)
  .get("/data/gps", getGPS)
  .listen(3007);

console.log("Metis stated listening on port 3007!");
