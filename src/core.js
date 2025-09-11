/* arduino-cli core
 * 主核管理
 */
import { Elysia } from "elysia";
import { gui } from "./gui/core";

export const core = (routePath) =>
  new Elysia().use(gui(routePath)).post(routePath, ({ body }) => {});
