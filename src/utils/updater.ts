import { execSync } from "node:child_process";
import { Logger } from "./logger";
import inquirer from "inquirer";
import { join } from "node:path";

async function updater() {
    let currentHash;
    let upstreamHash;

    let isOutdated = false;

    const gitDir = join(__dirname, "../../.git");

    try {
        currentHash = execSync(`git --git-dir "${gitDir}" show -s --format=%h`).toString().trim();
    } catch (err: any) {
        return Logger.error("UPDATER", `Unable to fetch current hash, skipping. Is git installed?\n${err}`);
    }

    try {
        Logger.log("UPDATER", "Checking for updates...");
        upstreamHash = execSync(`git --git-dir "${gitDir}" rev-parse --short HEAD`).toString().trim();

        if (currentHash == upstreamHash) isOutdated = false;

        if (currentHash !== upstreamHash) {
            await inquirer.prompt([
                {
                    name: "updaterprompt",
                    message: "There is an update available! Do you want to update?",
                    type: "confirm",
                    default() {
                        return true;
                    }
                }
            ]).then(async (response: { updaterprompt: boolean }) => {
                if (response.updaterprompt) {
                    try {
                        execSync(`git --git-dir "${gitDir}" reset --hard`);
                        execSync(`git --git-dir "${gitDir}" pull`);
                        execSync("npm i");
                        isOutdated = false;
                        Logger.log("UPDATER", "Updated successfully. Restart the bot to see changes.");
                        return process.exit();
                    } catch (err: any) {
                        isOutdated = true;
                        Logger.error("UPDATER", err);
                        Logger.info("UPDATER", "An error occured while updating, ignoring.");
                    }
                } else {
                    isOutdated = true;
                    Logger.log("UPDATER", "Update skipped.");
                }
            });
        } else {
            Logger.log("UPDATER", "No updates found.");
        }
    } catch (err: any) {
        isOutdated = true;
        Logger.error("UPDATER", err);
        Logger.info("UPDATER", "An error occured while updating, ignoring.");
    }
}

export { updater };
