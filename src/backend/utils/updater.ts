import { execSync } from "node:child_process";
import { Logger } from "@utils/logger.js";
import { getGh } from "@utils/pfetch.js";
import { config } from "./config.js";
import chalk from "chalk";

async function checkUpdates() {
    if (!config.modules.updater.enabled) return;

    try {
        const branch = runGit("git rev-parse --abbrev-ref HEAD");
        const currentHash = runGit("git rev-parse --short HEAD");

        const updates = await compareChanges(branch, currentHash);

        if (updates.length === 0) return Logger.info("UPDATER", "No updates found.");

        Logger.log("UPDATER", `${chalk.bold("New update(s) found!")} \n${await stringifyUpdates(updates)} Run \`git pull origin ${branch}\` to pull the new updates!`, { seperator: true });
    } catch (err) {
        Logger.error("UPDATE", "Unable to get commit hashes, is git installed?");
    }
}

function runGit(cmd: string) {
    return execSync(cmd).toString().trim();
}

async function stringifyUpdates(updates: any[]) {
    let string = "";
    updates.map((upd: any) => {
        string = string + `${upd.hash} | ${upd.author} | ${upd.message}\n`;
    });
    return string;
}

async function compareChanges(branch: string, currentHash: string) {
    const data = await getGh<{
        commits: Array<{
            hash: string
            author: string
            message: string
        }>
    }>(branch, currentHash);

    return data!.commits.map((c: any) => ({
        hash: c.sha.slice(0, 7),
        author: c.author.login,
        message: c.commit.message
    }));
}

export { checkUpdates };
