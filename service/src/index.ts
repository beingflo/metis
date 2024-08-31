import { Elysia, t } from "elysia";
import { gpsGroup } from "./gps";
import { dataGroup } from "./data";

new Elysia().group("/data", dataGroup).group("/gps", gpsGroup).listen(3007);

console.log("Metis stated listening on port 3007!");
