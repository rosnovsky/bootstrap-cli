import { executeShellCommand } from "./executeShellCommand.js";
import chalk from "chalk";
import { logError, logInfo } from "./logger.js";
import { Configuration, Software } from "../types.js";

export async function checkForUpdates(yamlConfig: Configuration) {
  let updatesAvailable = [];
  for (const software of yamlConfig.applications) {
    try {
      console.log(`Checking for updates for ${chalk.cyan(software.name)}...`);
      if (software.update) {
        const updateCheckOutput = await executeShellCommand(software.update);
        if (updateCheckOutput.includes(software.updateAvailableString)) {
          updatesAvailable.push(software);
        }
      }
    } catch (error) {
      logError(`Error checking for updates for ${software.name}`, error);
    }
  }
  logInfo("Update check completed.");
  return updatesAvailable;
}

export async function performUpdates(softwareList: Software[]) {
  for (const software of softwareList) {
    try {
      console.log(`Updating ${software.name}...`);
      await executeShellCommand(software.update);
      console.log(
        `${chalk.green(software.name)} has been updated successfully.`,
      );
    } catch (error) {
      logError(`Error updating ${software.name}`, error);
    }
  }
  logInfo("Updates have been installed.");
}
