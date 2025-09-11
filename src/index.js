import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { compile } from "./compile";
import { core } from "./core";
import { lib } from "./lib";

const app = new Elysia()
  .use(cors())
  .use(compile("/compile")) // 代码编译
  .use(core("/core")) // 主核管理
  .use(lib("/lib")) // 库管理
  .listen(8125);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
