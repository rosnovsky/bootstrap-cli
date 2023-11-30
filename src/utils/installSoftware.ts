import { executeShellCommand } from './executeShellCommand.js';
import os from 'os';
import chalk from 'chalk';
import { logError, logInfo } from './logger.js';

async function enableRootlessMode() {
  let rootlessSetupCommand;

  if (os.platform() === 'darwin') {
    rootlessSetupCommand = `
      brew install --cask docker
      /Applications/Docker.app/Contents/MacOS/Dockerd-rootless-setuptool.sh install
    `;
  } else if (os.platform() === 'linux') {
    rootlessSetupCommand = `
      curl -fsSL https://get.docker.com/rootless | sh
    `;
  } else {
    throw new Error('Unsupported OS. Docker rootless mode is only supported on macOS and Linux.');
  }

  await executeShellCommand(rootlessSetupCommand);
  console.log(chalk.green(`Docker has been configured to run in rootless mode.`));
}

export async function installSoftware(yamlConfig) {
  for (const software of yamlConfig.software) {
    console.log(`Installing ${software.name}...`);

    try {
      if (software.script) {
        await executeShellCommand(software.script);
      }

      if (software.name.toLowerCase() === 'docker') {
        await enableRootlessMode();
      }

      console.log(`${chalk.green(software.name)} has been installed successfully.`);
    } catch (error) {
      logError(`Error installing ${software.name}`, error);
    }
  }
  logInfo('Software installation completed.');
}
