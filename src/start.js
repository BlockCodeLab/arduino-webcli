import { arduinoService } from "./service";
import { compileGui } from "./gui/compile";
import { coreGui } from "./gui/core";
import { libGui } from "./gui/lib";

const app = arduinoService();

// 开启简易管理界面
if (process.env.GUI_PORT) {
  app
    .use(compileGui("/compile")) // 编译测试
    .use(coreGui("/core")) // 主核管理
    .use(libGui("/lib")); // 库管理
}

console.log(
  `🦊 Elysia is running at ${app.server.hostname}:${app.server.port}`,
);
