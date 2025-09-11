/* arduino-cli core
 * 主核管理界面
 */
import { Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";
import { menubar } from "./menubar";

export const gui = (routePath) =>
  new Elysia().use(html()).get(`${routePath}/gui`, () => (
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="///unpkg.com/zui/dist/zui.css" />
        <script src="///unpkg.com/zui/dist/zui.js" />
      </head>
      <body class="container m-2">{menubar(routePath)}</body>
    </html>
  ));
