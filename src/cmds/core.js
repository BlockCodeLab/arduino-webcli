/* arduino-cli core
 * 主核管理
 */
import { arduinoCliSync } from "./arduino-cli";

export const arduinoCoreRemoteList = () => {
  let result;
  try {
    result = JSON.parse(arduinoCliSync("core", "search").toString() || "{}");
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};

export const arduinoCoreList = () => {
  let result;
  try {
    result = JSON.parse(arduinoCliSync("core", "list").toString() || "{}");
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};

export const arduinoCoreInstall = (id) => {
  let result;
  try {
    result = JSON.parse(
      arduinoCliSync("core", "install", id).toString() || "{}",
    );
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};

export const arduinoCoreUninstall = (id) => {
  let result;
  try {
    result = JSON.parse(
      arduinoCliSync("core", "uninstall", id).toString() || "{}",
    );
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};
