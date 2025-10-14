import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { compileService } from "./service";
import { compileGui } from "./gui/compile";
import { coreGui } from "./gui/core";
import { libGui } from "./gui/lib";

export function arduinoService(cfg = {}) {
  // 启动服务器
  cfg.serve = cfg.serve || {};
  cfg.serve.idleTimeout = 0;
  const app = new Elysia(cfg).use(cors());

  // 开启简易管理界面
  if (process.env.GUI_PORT) {
    app
      .use(compileGui("/compile")) // 编译测试
      .use(coreGui("/core")) // 主核管理
      .use(libGui("/lib")); // 库管理
  }

  // 开启编译服务
  else {
    app.post("/compile", ({ body }) => compileService(body));
  }

  return app;
}
