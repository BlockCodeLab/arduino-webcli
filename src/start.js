import { arduinoService } from "./app";

const app = arduinoService().listen(process.env.GUI_PORT ?? 18125);
console.log(
  `🦊 Elysia is running at ${app.server.hostname}:${app.server.port}`,
);
