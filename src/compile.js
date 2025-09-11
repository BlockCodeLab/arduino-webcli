/* arduino-cli compile
 * 编译
 */
import { tmpdir } from "node:os";
import { basename, extname, resolve } from "node:path";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { Elysia, file } from "elysia";
import { gui, preview } from "./gui/compile";
import { arduinoCli } from "./arduino-cli";

const arduinoCompile = (fqbn, sketch) => {
  let result;
  try {
    result = JSON.parse(arduinoCli("compile", "-b", fqbn, sketch).toString());
  } catch (err) {
    result = {
      success: false,
    };
  }
  return result;
};

const jsonResult = (result) => ({
  success: result.success,
  message: result.error ?? result.message,
  hex: readFileSync(result.hexFile).toString(),
});

const fileResult = (result) => (result.success ? file(result.hexFile) : null);

export const compile = (routePath) =>
  new Elysia().use(gui(routePath)).post(routePath, async ({ body }) => {
    // 保存临时 sketch
    const sketchDir = mkdtempSync(resolve(tmpdir(), "sketch_"));
    const mainFile = basename(sketchDir);
    if (body.sketch instanceof File && body.sketch.size) {
      body.sketch = [body.sketch];
    }
    if (Array.isArray(body.sketch)) {
      for (const file of body.sketch) {
        const name =
          basename(file.name, ".c") || extname(file.name) === ".ino"
            ? `${mainFile}.ino`
            : file.name;
        writeFileSync(resolve(sketchDir, name), await file.arrayBuffer());
      }
    }

    // 编译 sketch 并返回 hex 文件
    const result = arduinoCompile(body.fqbn, sketchDir);
    result.hexFile = resolve(
      sketchDir,
      "build",
      body.fqbn.replaceAll(":", "."),
      `${mainFile}.ino.hex`,
    );

    // 根据返回类型返回结果
    switch (body.resultType) {
      case "file":
        return fileResult(result);
      case "preview":
        return preview(routePath, jsonResult(result));
      case "json":
      default:
        return jsonResult(result);
    }
  });
