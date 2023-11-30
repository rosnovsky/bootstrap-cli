export type Configuration = {
  version: string;
  applications: Software[];
};

export type Software = {
  name: string;
  type: "cli" | "web" | "library";
  description: string;
  url: string;
  repository: string;
  install: string;
  update: string;
};

export type Action = {
  action: "install_software" | "check_for_software_updates" | "exit";
};
