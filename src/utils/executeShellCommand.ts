import { exec } from 'child_process';

export function executeShellCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(stderr);
      }
      resolve(stdout);
    });
  });
}
