/*
 * 主核管理界面
 */
import { Elysia } from "elysia";
import { Html, html } from "@elysiajs/html";
import { menubar } from "./menubar";
import {
  arduinoCoreList,
  arduinoCoreRemoteList,
  arduinoCoreInstall,
  arduinoCoreUninstall,
} from "../cmds/core";

const installCore = async (checkbox, routePathGui, id, name) => {
  const alert = zui.Messager.show({
    content: `正在${checkbox.checked ? "安装" : "卸载"}“${name}”…`,
    placement: "top-right",
    close: false,
    time: 0,
  });
  const res = await fetch(
    `${routePathGui}/${checkbox.checked ? "i" : "u"}/${id}`,
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

export const coreGui = (routePath) => {
  const routePathGui = `/gui${routePath}`;

  const wrapInstallClick = (id, name) =>
    `(${installCore.toString()})(this, "${routePathGui}", "${id}", "${name}")`;

  return new Elysia()
    .use(html())
    .post(`${routePathGui}/:cmd/:id`, ({ params: { cmd, id } }) => {
      switch (cmd) {
        case "i":
          return arduinoCoreInstall(id);
        case "u":
          return arduinoCoreUninstall(id);
        default:
          return {
            success: false,
            message: "未知命令",
          };
      }
    })
    .get(routePathGui, () => {
      const allCores = arduinoCoreRemoteList();
      const installedCores = Object.fromEntries(
        arduinoCoreList()
          .platforms.filter((platform) => platform.installed_version)
          .map((platform) => [platform.id, platform.installed_version]),
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
            <table class="table table-striped table-hover bordered m-2 mt-4">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>主核名称</th>
                  <th>提供者</th>
                  <th>可用开发板</th>
                  <th>安装版本</th>
                  <th>最新版本</th>
                </tr>
              </thead>
              <tbody>
                {allCores.platforms
                  .filter((platform) => !platform.deprecated)
                  .map((platform) => (
                    <tr>
                      <td>
                        <span class="label size-lg">{platform.id}</span>
                      </td>
                      <td>{platform.releases[platform.latest_version].name}</td>
                      <td>{platform.maintainer}</td>
                      <td>
                        {(
                          platform.releases[platform.installed_version] ||
                          platform.releases[platform.latest_version]
                        ).boards.map((board) => (
                          <div class="row space-x-2 my-1 whitespace-nowrap">
                            <div>{board.name}</div>
                            {board.fqbn && (
                              <div class="label">{board.fqbn}</div>
                            )}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div class="switch">
                          {installedCores[platform.id] ===
                          platform.installed_version ? (
                            <input
                              type="checkbox"
                              id={platform.id}
                              onclick={wrapInstallClick(
                                platform.id,
                                platform.releases[platform.latest_version].name,
                              )}
                              checked
                            />
                          ) : (
                            <input
                              type="checkbox"
                              id={platform.id}
                              onclick={wrapInstallClick(
                                platform.id,
                                platform.releases[platform.latest_version].name,
                              )}
                            />
                          )}
                          <label for={platform.id}>
                            {platform.installed_version}
                          </label>
                        </div>
                      </td>
                      <td>{platform.latest_version}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </body>
        </html>
      );
    });
};
