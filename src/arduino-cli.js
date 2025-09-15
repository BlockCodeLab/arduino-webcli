/* arduino-cli
 * 命令行工具
 */
import { resolve } from "node:path";
import { sync as spawnSync } from "cross-spawn";

const DEFAULT_PATH = resolve(process.cwd(), "arduino");
let arduinoCliPath = DEFAULT_PATH;

export const arduinoCliSync = (command, ...args) => {
  const { stderr, stdout } = spawnSync(
    "./arduino-cli",
    ["--json", "--config-dir", "./", command, ...args],
    { cwd: arduinoCliPath },
  );
  return stderr?.length > 0 ? stderr : stdout;
};

export const setArduinoCliPath = (path = DEFAULT_PATH) =>
  (arduinoCliPath = path);
