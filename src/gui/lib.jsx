/*
 * 库管理界面
 */
import { Elysia } from "elysia";
import { Html, html } from "@elysiajs/html";
import { menubar } from "./menubar";
import {
  arduinoLibList,
  arduinoLibSearch,
  arduinoLibInstall,
  arduinoLibUninstall,
} from "../cmds/lib";

const installLib = async (checkbox, routePathGui, name) => {
  const alert = zui.Messager.show({
    content: `正在${checkbox.checked ? "安装" : "卸载"}“${name}”…`,
    placement: "top-right",
    close: false,
    time: 0,
  });
  const res = await fetch(
    `${routePathGui}/${checkbox.checked ? "i" : "u"}/${name}`,
    {
      method: "post",
      mode: "cors",
    },
  );
  const result = await res.json();
  alert.hide();
  zui.Messager.show({
    content:
      `“${name}”${checkbox.checked ? "安装" : "卸载"}` +
      `${result.success !== false ? "成功。" : `失败${result.message ? `：${result.message}。` : "。"}`}`,
    placement: "top-right",
    type: result.success !== false ? "success" : "danger",
  });
};

export const libGui = (routePath) => {
  const routePathGui = `/gui${routePath}`;

  const wrapInstallClick = (name) =>
    `(${installLib.toString()})(this, "${routePathGui}", "${name}")`;

  return new Elysia()
    .use(html())
    .post(`${routePathGui}/:cmd/:name`, ({ params: { cmd, name } }) => {
      switch (cmd) {
        case "i":
          return arduinoLibInstall(name);
        case "u":
          return arduinoLibUninstall(name);
        default:
          return {
            success: false,
            message: "未知命令",
          };
      }
    })
    .get(`${routePathGui}/:keyword?`, ({ params: { keyword } }) => {
      const installed = arduinoLibList();
      const allLibs = keyword
        ? arduinoLibSearch(keyword).libraries
        : installed.installed_libraries;
      const installedLibs = Object.fromEntries(
        installed.installed_libraries.map(({ library }) => [
          library.name,
          library.version,
        ]),
      );

      return (
        <html lang="zh-CN">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="stylesheet" href="///unpkg.com/zui/dist/zui.css" />
            <script src="///unpkg.com/zui/dist/zui.js" />
          </head>
          <body class="container my-2">
            {menubar(routePath)}
            <div class="row space-x-3 ml-3 mt-4">
              <div
                id="keyword"
                zui-create
                zui-create-searchBox={`{
                  defaultValue: "${keyword || ""}",
                  placeholder: "已安装的库",
                  circle: true,
                  onClear: () => ${
                    keyword ? `window.location.href="${routePathGui}"` : "false"
                  }
                  }`}
              ></div>
              <button
                type="button"
                class="btn primary circle"
                onclick={`window.location.href="${routePathGui}/" + document.querySelector('#keyword input').value`}
              >
                搜索
              </button>
            </div>
            <table class="table table-striped table-hover bordered m-2">
              <thead>
                <tr>
                  <th>库名称</th>
                  <th>提供者</th>
                  <th>说明</th>
                  <th>分类</th>
                  <th>{keyword ? "最新版本" : "版本"}</th>
                  <th>{keyword ? "安装" : "卸载"}</th>
                </tr>
              </thead>
              <tbody>
                {allLibs.map((item) => {
                  const lib =
                    item.library ??
                    Object.assign({ name: item.name }, item.latest);
                  return (
                    <tr>
                      <td>
                        <a class="font-bold" href={lib.website} target="_blank">
                          {lib.name}
                        </a>
                      </td>
                      <td>{lib.maintainer}</td>
                      <td>{lib.paragraph}</td>
                      <td>{lib.category}</td>
                      <td>{lib.version}</td>
                      <td>
                        <div class="switch">
                          {installedLibs[lib.name] ? (
                            <input
                              type="checkbox"
                              id={lib.name}
                              onclick={wrapInstallClick(lib.name)}
                              checked
                            />
                          ) : (
                            <input
                              type="checkbox"
                              id={lib.name}
                              onclick={wrapInstallClick(lib.name)}
                            />
                          )}
                          <label for={lib.name}>
                            {keyword ? installedLibs[lib.name] : ""}
                          </label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </body>
        </html>
      );
    });
};
