/* arduino-cli lib
 * 库管理
 */
import { Elysia } from "elysia";
import { gui } from "../gui/lib";

export const lib = (routePath) =>
  new Elysia().use(gui(routePath)).post(routePath, ({ body }) => {});
