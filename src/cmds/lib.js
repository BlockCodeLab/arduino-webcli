/* arduino-cli lib
 * 库管理
 */
import { arduinoCliSync } from "./arduino-cli";

export const arduinoLibSearch = (keyword) => {
  let result;
  try {
    result = JSON.parse(
      arduinoCliSync("lib", "search", keyword).toString() || "{}",
    );
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};

export const arduinoLibList = () => {
  let result;
  try {
    result = JSON.parse(arduinoCliSync("lib", "list").toString() || "{}");
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};

export const arduinoLibInstall = (id) => {
  let result;
  try {
    result = JSON.parse(
      arduinoCliSync("lib", "install", id).toString() || "{}",
    );
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};

export const arduinoLibUninstall = (id) => {
  let result;
  try {
    result = JSON.parse(
      arduinoCliSync("lib", "uninstall", id).toString() || "{}",
    );
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};
