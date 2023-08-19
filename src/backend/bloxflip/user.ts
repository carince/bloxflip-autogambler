import chalk from "chalk";
import { Logger } from "@utils/logger.js";
import { getBfUser } from "@utils/pfetch.js";
import { config } from "@utils/config.js";
import { data } from "@bf/data.js";

async function checkAuth(): Promise<void> {
    Logger.info("USER", "Fetching user information.");

    const bfUser = await getBfUser();

    const baseBet = +(+bfUser!.user.wallet.toFixed(2) / Math.pow(2, config.bet.tries)).toFixed(2);

    if (baseBet === 0) {
        return Logger.error("USER", "Tries in config is too high causing the bet to be 0", { forceClose: true });
    }

    Logger.log("USER",
        `${chalk.bold("Successfully logged in!")} \nUsername: ${bfUser!.user.robloxUsername} \nID: ${bfUser!.user.robloxId} \nBalance: ${+bfUser!.user.wallet.toFixed(2)} R$`
    );

    data.updateProfile({
        username: bfUser!.user.robloxUsername,
        id: bfUser!.user.robloxId
    });

}

export { checkAuth };
