import fs from "fs";
import os from "os";

type Entry = string | number | boolean | object;

function formatLogEntry(entry: Entry, level = "INFO") {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}]: ${entry}${os.EOL}`;
}

export function logInfo(message: string) {
  fs.appendFileSync("bootstrap_cli.log", formatLogEntry(message), "utf8");
}

export function logWarn(message: string) {
  fs.appendFileSync(
    "bootstrap_cli.log",
    formatLogEntry(message, "WARN"),
    "utf8",
  );
}

export function logError(message: string, error: Error) {
  const errorMessage = `${message}: ${error.message}`;
  console.error(errorMessage); // Displaying the error message on the console
  fs.appendFileSync(
    "bootstrap_cli.log",
    formatLogEntry(errorMessage, "ERROR"),
    "utf8",
  );
}
