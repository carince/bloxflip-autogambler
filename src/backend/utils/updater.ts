import { execSync } from "node:child_process"
import { Logger } from "./logger.js"
import chalk from "chalk"

async function checkUpdates() {
    try {
        function runGit(cmd: string) {
            return execSync(cmd).toString().replace(/\n$/, "")
        }

        const branch = runGit(`git rev-parse --abbrev-ref HEAD`)
        const currentHash = runGit(`git rev-parse --short HEAD`)
        const githubHash = runGit(`git rev-parse --short origin/${branch}`)

        if (currentHash != githubHash) {
            Logger.log(`UPDATER`, `${chalk.bold(`New update has been pushed onto branch ${branch}!`)} \nCurrent Hash: ${currentHash} \nGitHub Hash: ${githubHash} \nRun "git pull origin ${branch}" to pull the new commits!`, { seperator: true })
        }
    } catch (err) {
        Logger.error(`UPDATE`, `Unable to get commit hashes, is git installed?`)
    }
}

export { checkUpdates }