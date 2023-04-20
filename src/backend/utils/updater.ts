import { execSync } from "node:child_process"
import { Logger } from "./logger.js"
import { get } from "./pfetch.js"
import chalk from "chalk"

async function checkUpdates() {
    try {
        function runGit(cmd: string) {
            return execSync(cmd).toString().replace(/\n$/, "")
        }

        const branch = runGit(`git rev-parse --abbrev-ref HEAD`)
        const currentHash = runGit(`git rev-parse --short HEAD`)

        const updates = await calculateGitChanges(branch, currentHash)

        if (updates.length === 0) return Logger.info(`UPDATER`, `No updates found.`)

        Logger.log(`UPDATER`, `${chalk.bold(`New update(s) found!`)} \n${await stringifyUpdates(updates)} Run \`git pull origin ${branch}\` to pull the new updates!`, { seperator: true })
    } catch (err) {
        Logger.error(`UPDATE`, `Unable to get commit hashes, is git installed?`)
    }

    async function stringifyUpdates(updates: any[]) {
        let string = ''
        updates.map((upd: any) => {
            string = string + `${upd.hash} | ${upd.author} | ${upd.message}\n`
        })
        return string
    }

    async function calculateGitChanges(branch: string, currentHash: string) {
        const data = await get(`https://api.github.com/repos/carince/bloxflip-autocrash/compare/${currentHash}...${branch}`);

        return data.commits.map((c: any) => ({
            hash: c.sha.slice(0, 7),
            author: c.author.login,
            message: c.commit.message
        }));
    }
}

export { checkUpdates }