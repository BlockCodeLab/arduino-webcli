/* arduino-cli compile
 * 编译界面
 */
import { Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";
import { menubar } from "./menubar";

const spinIcon = '<i class="animate-spin icon icon-spinner-indicator"></i>';
const downIcon = '<i class="bounce icon icon-arrow-down"></i>';
const submitButton = (inner) =>
  `document.querySelector("#submitButton").innerHTML='${inner}'`;

export const gui = (routePath) => {
  const fqbnItems = [
    { text: "Arduino UNO", value: "arduino:avr:uno", keys: "avr uno" },
    { text: "Arduino Nano", value: "arduino:avr:nano", keys: "avr nano" },
  ];

  return new Elysia().use(html()).get(`${routePath}/gui`, () => (
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="///unpkg.com/zui/dist/zui.css" />
        <script src="///unpkg.com/zui/dist/zui.js" />
      </head>
      <body class="container m-2">
        {menubar(routePath)}
        <form
          action={routePath}
          class="form form-horz py-4"
          enctype="multipart/form-data"
          method="post"
        >
          <div class="form-row">
            <div class="form-group  w-1/3">
              <label class="form-label">开发板</label>
              <div
                zui-create
                zui-create-picker={JSON.stringify({
                  name: "fqbn",
                  items: fqbnItems,
                  defaultValue: "arduino:avr:uno",
                  placeholder: "请选择使用的开发板",
                  searchHint: "搜索开发板",
                })}
                style="width:100%"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">文件</label>
              <div
                zui-create
                zui-create-fileSelector={JSON.stringify({
                  name: "sketch",
                  mode: "grid",
                  accept: ".ino,.c,.h",
                  maxFileSize: "2MB",
                })}
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">编译后返回</label>
              <div class="check-list">
                <div class="radio-primary">
                  <input
                    type="radio"
                    id="typeJson"
                    name="resultType"
                    value="preview"
                    checked="checked"
                    zui-on-change={submitButton("提交")}
                  />
                  <label for="typeJson">
                    JSON
                    <span class="muted">
                      （用 Base64 编码的编译后文件数据）
                    </span>
                  </label>
                </div>
                <div class="radio-primary">
                  <input
                    type="radio"
                    id="typeFile"
                    name="resultType"
                    value="file"
                    zui-on-change={submitButton(`${downIcon} 下载`)}
                  />
                  <label for="typeFile">
                    文件 <span class="muted">（可下载的编译后文件）</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group gap-4">
              <button
                type="submit"
                id="submitButton"
                class="btn primary btn-wide"
              >
                提交
              </button>
            </div>
          </div>
        </form>
      </body>
    </html>
  ));
};

export const preview = (routePath, result) => (
  <html lang="zh-CN">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="///unpkg.com/zui/dist/zui.css" />
      <script src="///unpkg.com/zui/dist/zui.js" />
    </head>
    <body class="container m-2">
      {menubar(routePath)}
      <form class="form form-horz py-4">
        <div class="form-row">
          <div class="form-group w-1/2">
            <label class="form-label">success</label>
            <input
              type="text"
              class="form-control"
              value={result.success ? "true" : "false"}
              readonly
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">message</label>
            <input
              type="text"
              class="form-control"
              value={result.message}
              readonly
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">hex</label>
            <textarea rows="10" class="form-control" readonly>
              {result.hex}
            </textarea>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group gap-4">
            <a class="btn primary btn-wide" href={`${routePath}/gui`}>
              返回
            </a>
          </div>
        </div>
      </form>
    </body>
  </html>
);
