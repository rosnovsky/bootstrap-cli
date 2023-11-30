import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import { fetchYamlFromGist } from "./utils/parseYamlFromGist.js";
import { installSoftware } from "./utils/installSoftware.js";
import { checkForUpdates, performUpdates } from "./utils/checkForUpdates.js";
import { logError } from "./utils/logger.js";
import { Action } from "./types.js";

console.log(
  chalk.blueBright(figlet.textSync("Bootstrap", { horizontalLayout: "full" })),
);

async function mainMenu() {
  const actions = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Install software", value: "install_software" },
        {
          name: "Check for software updates",
          value: "check_for_software_updates",
        },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);
  await handleActionResponse(actions);
}

async function handleActionResponse(response: Action) {
  try {
    switch (response.action) {
      case "install_software":
        const gistUrl = await promptForGistUrl();
        const yamlConfig = await fetchYamlFromGist(gistUrl);
        await installSoftware(yamlConfig);
        break;
      case "check_for_software_updates":
        const gistUrlForUpdates = await promptForGistUrl();
        const yamlConfigForUpdates = await fetchYamlFromGist(gistUrlForUpdates);
        const updates = await checkForUpdates(yamlConfigForUpdates);
        if (updates.length > 0) {
          console.log(
            chalk.yellow("The following software has updates available:"),
          );
          updates.forEach((software) => console.log(`- ${software.name}`));
          const confirmUpdate = await inquirer.prompt([
            {
              type: "confirm",
              name: "executeUpdates",
              message: "Would you like to install the updates?",
              default: false,
            },
          ]);

          if (confirmUpdate.executeUpdates) {
            await performUpdates(updates);
          } else {
            console.log(chalk.green("No updates have been installed."));
          }
        } else {
          console.log(chalk.green("All software is up-to-date."));
        }
        break;
      case "exit":
        console.log(chalk.green("Thank you for using Bootstrap_CLI!"));
        process.exit(0);
      default:
        console.error(chalk.red("Unknown action"));
        break;
    }
  } catch (error) {
    logError("Unexpected error occurred in handleActionResponse", error);
    console.log(
      chalk.red(
        "An unexpected error occurred. Please check the logs for more details.",
      ),
    );
    process.exit(1);
  }
}

async function promptForGistUrl() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "gistUrl",
      message:
        "Enter the GitHub Gist URL for the YAML installation configuration:",
      validate: (input) => (input ? true : "Gist URL cannot be empty."),
    },
  ]);
  return answers.gistUrl;
}

mainMenu().catch((err) => {
  logError("Unhandled error occurred in mainMenu", err);
  console.log(
    chalk.red(
      "An error occurred during the execution of the application. Please check the logs for more details.",
    ),
  );
});
