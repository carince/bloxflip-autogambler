import { execSync } from "node:child_process";
import { Logger } from "@utils/logger.js";
import { page } from "@utils/browser.js";
import { sleep } from "@utils/sleep.js";
import { config } from "./config.js";
import { USER_AGENT } from "@utils/constants.js";
import chalk from "chalk";

async function checkUpdates() {
    if (!config.modules.updater.enabled) return;

    try {
        const branch = runGit("git rev-parse --abbrev-ref HEAD");
        const currentHash = runGit("git rev-parse --short HEAD");

        const updates = await calculateGitChanges(branch, currentHash);

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

async function calculateGitChanges(branch: string, currentHash: string) {
    const data = await ghGet(`https://api.github.com/repos/carince/bloxflip-autocrash/compare/${currentHash}...${branch}`);

    return data.commits.map((c: any) => ({
        hash: c.sha.slice(0, 7),
        author: c.author.login,
        message: c.commit.message
    }));
}

async function ghGet(url: string): Promise<any> {
    let tries = 0;

    async function api(): Promise<any> {
        tries++;
        const res = await page.evaluate(async (url: string, USER_AGENT: string) => {
            let api;
            try {
                api = await fetch(url, {
                    method: "get",
                    mode: "cors",
                    credentials: "omit",
                    headers: { "User-Agent": USER_AGENT },
                });
            } catch (err) {
                return { apiError: err };
            }

            if (!api.ok) return { apiError: api.status };
            return api.json();
        }, url, USER_AGENT);

        if (res.apiError) {
            Logger.warn("PFETCH", `Fetching failed, trying again... \nError: ${JSON.stringify(res)} \nLink: ${url}`);
            await sleep(2000);
            if (tries === 5) return Logger.error("PFETCH", `Fetching failed, \nError: ${JSON.stringify(res)} \nLink: ${url}`, true);
            return await api();
        } else {
            return res;
        }
    }

    return await api();
}

export { checkUpdates };
