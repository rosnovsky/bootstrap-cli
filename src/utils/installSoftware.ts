import { executeShellCommand } from "./executeShellCommand.js";
import chalk from "chalk";
import { logError, logInfo } from "./logger.js";
import { Configuration } from "../types.js";

export async function installSoftware(yamlConfig: Configuration) {
  for (const software of yamlConfig.applications) {
    console.log(`Installing ${software.name}...`);

    try {
      if (software.install) {
        await executeShellCommand(software.install);
      }

      console.log(
        `${chalk.green(software.name)} has been installed successfully.`,
      );
    } catch (error) {
      logError(`Error installing ${software.name}`, <Error>error);
    }
  }
  logInfo("Software installation completed.");
}
