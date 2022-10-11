import { execSync } from "node:child_process";
import { Logger } from "./logger";
import inquirer from "inquirer";
export let isOutdated = false;
export let isLatest = false;
let currentHash;
let upstreamHash;

export async function updater() {
    try {
        currentHash = execSync("git show -s --format=%h").toString().trim();
    } catch (e: any) {
        currentHash = null;
        Logger.error("UPDATER", e);
    }

    try {
        Logger.log("UPDATER", "Checking for updates...");
        upstreamHash = execSync("git rev-parse --short HEAD").toString().trim();

        if (currentHash == upstreamHash) isLatest = true;

        if (currentHash != upstreamHash) {
            isOutdated = false;
            inquirer.prompt([
                {
                    message: "There is an update available! Do you want to update?",
                    type: "list",
                    choices: ["Yes", "No"]
                }
            ]).then((response: string) => {
                if (response == "Yes") {
                    console.log("Ye");
                } else {
                    console.log("Nah");
                }
            });
        } else {
            Logger.log("UPDATER", "No updates found.");
        }
    } catch (e: any) {
        Logger.error("UPDATER", e);
    }
}
