import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { setArduinoCliPath } from "./arduino-cli";
import { compileRequest } from "./commands/compile";

const PORT = process.env.GUI_PORT ?? 18125;

export function arduinoService(opts = {}) {
  const { arduinoCliPath, ...cfg } = opts;
  setArduinoCliPath(arduinoCliPath);

  // 启动服务器
  cfg.serve = cfg.serve || {};
  cfg.serve.idleTimeout = 0;
  return new Elysia(cfg)
    .use(cors())
    .post("/compile", ({ body }) => compileRequest(body))
    .listen(PORT);
}
