/*
 * 库管理界面
 */
import { Elysia } from "elysia";
import { Html, html } from "@elysiajs/html";
import { menubar } from "./menubar";

export const libGui = (routePath) =>
  new Elysia().use(html()).get(`/gui${routePath}`, () => (
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="///unpkg.com/zui/dist/zui.css" />
        <script src="///unpkg.com/zui/dist/zui.js" />
      </head>
      <body class="container my-2">{menubar(routePath)}</body>
    </html>
  ));
