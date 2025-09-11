/* arduino-cli
 * 命令行工具
 */
import { cwd } from "node:process";
import { resolve } from "node:path";
import { sync as spawnSync } from "cross-spawn";

const arduinoPath = resolve(cwd(), "arduino");

export const arduinoCli = (command, ...args) => {
  const { stderr, stdout } = spawnSync(
    "./arduino-cli",
    ["--json", "--config-dir", "./", command, ...args],
    {
      cwd: arduinoPath,
    },
  );
  return stderr.length > 0 ? stderr : stdout;
};
