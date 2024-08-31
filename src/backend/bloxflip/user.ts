import { config } from "@utils/config.js";
import Logger from "@utils/logger.js";
import frmt from "@utils/number.js";
import fetchUserData from "@utils/pfetch.js";
import chalk from "chalk";

export default async function login(): Promise<void> {
    Logger.info("USER", "Fetching user information.");

    const { user } = await fetchUserData();

    const wallet = frmt(user.wallet + user.bonusWallet);
    const baseBet = frmt(wallet / 2 ** config.tries);

    if (baseBet === 0) {
        return Logger.error("USER", "Tries in config is too high causing the bet to be 0", { forceClose: true });
    }

    return Logger.log(
        "USER",
        `${chalk.bold("Successfully logged in!")} \nUsername: ${user.robloxUsername} \nID: ${user.robloxId} \nBalance: ${wallet} R$`,
    );
}
