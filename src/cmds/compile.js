/* arduino-cli compile
 * 编译
 */
import { arduinoCliSync } from "./arduino-cli";

export const arduinoCompile = (fqbn, sketch) => {
  let result;
  try {
    result = JSON.parse(
      arduinoCliSync("compile", "-b", fqbn, sketch).toString() || "{}",
    );
  } catch (err) {
    result = {
      success: false,
      message: err.message,
    };
  }
  return result;
};
