import { Elysia } from "elysia";

new Elysia().get("/", () => "Hello World").listen(3000);
