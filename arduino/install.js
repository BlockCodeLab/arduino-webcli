/* 安装 arduino-cli
 *
 * Linux:
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_32bit.tar.gz
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_ARMv7.tar.gz
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_ARM64.tar.gz
 *
 * Windows:
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Windows_32bit.zip
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Windows_64bit.zip
 *
 * macOS:
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_macOS_64bit.tar.gz
 * https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_macOS_ARM64.tar.gz
 */
import { cwd, arch, platform } from "node:process";
import { mkdtempSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { $ } from "bun";

const DOWNLOAD_URL = "https://downloads.arduino.cc/arduino-cli";
const VERSION = "latest";

// 获取当前CPU
const ARCH = (() => {
  switch (arch) {
    case "ia32":
      return "32bit";
    case "x64":
      return "64bit";
    case "arm":
      return "ARMv7";
    case "arm64":
      return "ARM64";
  }
})();

// 获取当前系统
const PLATFROM = (() => {
  switch (platform) {
    case "linux":
      return "Linux";
    case "darwin":
      return "macOS";
    case "win32":
      return "Windows";
  }
})();

// 下载文件后缀名
const EXTNAME = PLATFROM === "Windows" ? "zip" : "tar.gz";

console.log("Start to install arduino-cli.");

// 下载最新版本
const installDir = `${cwd()}/arduino`;
const downloadUrl = `${DOWNLOAD_URL}/arduino-cli_${VERSION}_${PLATFROM}_${ARCH}.${EXTNAME}`;
const response = await fetch(downloadUrl);
console.log("Downloading arduino-cli...");

// 保存到临时文件
const count = 20;
const chunkSymbols = [].concat(
  Array(count).fill("-"),
  Array(count).fill("\\"),
  Array(count).fill("|"),
  Array(count).fill("/"),
);
const symbolsLength = chunkSymbols.length;
let symbolIndex = 0;

const sink = new Bun.ArrayBufferSink();
sink.start({
  asUint8Array: true,
  stream: true,
});
const tmpfile = resolve(
  mkdtempSync(resolve(tmpdir(), "arduino_")),
  `arduino_cli.${EXTNAME}`,
);
const fileWriter = Bun.file(tmpfile).writer();
for await (const chunk of response.body) {
  fileWriter.write(chunk);
  console.log(`${chunkSymbols[symbolIndex++ % symbolsLength]}\x1b[1A`);
  fileWriter.flush();
}
console.log("Done.\x1b[K");
fileWriter.end();

// 解压文件到 installDir
console.log("Installing arduino-cli...");
if (PLATFROM === "Windows") {
  await $`unzip -d "${tmpfile}" "${installDir}"`;
} else {
  await $`tar xf "${tmpfile}" -C "${installDir}"`;
}
console.log("Done.");
