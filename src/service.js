import { tmpdir } from "node:os";
import { basename, extname, resolve } from "node:path";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { arduinoCompile } from "./cmds/compile";

export { setArduinoCliPath } from "./cmds/arduino-cli";

const jsonResult = (result) => {
  let hexBase64 = "";
  if (result.success !== false) {
    try {
      hexBase64 = btoa(readFileSync(result.hexFile).toString());
    } catch (err) {
      result.success = false;
      result.error = err.message;
    }
  }
  return {
    success: result.success !== false,
    message: result.error ?? result.message,
    hex: hexBase64,
  };
};

export const compileService = async (body) => {
  // 解析 JSON 数据
  if (body.json) {
    const json = JSON.parse(body.json);
    body.fqbn = json.fqbn;
    body.resultType = json.resultType;
    if (typeof json.sketch === "string") {
      body.sketch = [new File([atob(json.sketch)], `main.ino`)];
    }
    if (Array.isArray(json.sketch)) {
      const sketch = [];
      for (const file of json.sketch) {
        sketch.push(new File([atob(file.content)], file.name));
      }
      body.sketch = sketch;
    }
  }

  // 保存临时 sketch
  const sketchDir = mkdtempSync(resolve(tmpdir(), "sketch_"));
  const mainFile = basename(sketchDir);
  if (body.sketch instanceof File && body.sketch.size) {
    body.sketch = [body.sketch];
  }
  if (Array.isArray(body.sketch)) {
    for (const file of body.sketch) {
      const name =
        basename(file.name, ".c") === "main" || extname(file.name) === ".ino"
          ? `${mainFile}.ino`
          : file.name;
      const arrayBuffer = await file.arrayBuffer();
      writeFileSync(resolve(sketchDir, name), Buffer.from(arrayBuffer));
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

  // 返回 json 结果
  if (body.resultType === "json") {
    return jsonResult(result);
  }
  return result;
};
