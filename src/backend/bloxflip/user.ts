import chalk from "chalk";
import { Logger } from "@utils/logger.js";
import { getBfUser, sendWh } from "@utils/pfetch.js";
import { config } from "@utils/config.js";

async function checkAuth(): Promise<void> {
    Logger.info("USER", "Fetching user information.");

    const bfUser = await getBfUser();

    const baseBet = +(+bfUser!.user.wallet.toFixed(2) / Math.pow(2, config.bet.tries)).toFixed(2);

    if (baseBet === 0) {
        return Logger.error("USER", "Tries in config is too high causing the bet to be 0", { forceClose: true });
    }

    Logger.log("USER",
        `${chalk.bold("Successfully logged in!")} \nUsername: ${bfUser!.user.robloxUsername} \nID: ${bfUser!.user.robloxId} \nBalance: ${+bfUser!.user.wallet.toFixed(2)} R$`,
        { seperator: true }
    );
    sendWh({
        "embeds": [
            {
                "title": "Successfully logged in!",
                "color": 3092790,
                "fields": [
                    {
                        "name": "Username",
                        "value": bfUser!.user.robloxUsername,
                        "inline": true
                    },
                    {
                        "name": "Roblox ID",
                        "value": bfUser!.user.robloxId,
                        "inline": true
                    },
                    {
                        "name": "Balance",
                        "value": `${+bfUser!.user.wallet.toFixed(2) } R$ ${config.bet.custom ? "(Custom)" : ""}`,
                        "inline": true
                    },
                    {
                        "name": "Bet",
                        "value": `**Tries: **${config.bet.tries}\n**Base Bet: **${baseBet}`,
                        "inline": true
                    },
                    {
                        "name": "Modules",
                        "value": `**Rain: **${config.modules.rain.enabled}, ${config.modules.rain.minimum} R$\n**Analytics: **${config.modules.analytics.enabled}\n**Updater: **${config.modules.updater.enabled}`,
                        "inline": true
                    }
                ],
                "footer": {
                    "text": "bloxflip-autocrash"
                }
            }
        ]
    });
}

export { checkAuth };
