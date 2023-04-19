import chalk from "chalk";
import { Logger } from "@utils/logger.js";
import { sendWh } from "@utils/webhook.js";
import { get } from "@utils/pfetch.js";
import { config } from "@utils/config.js";

async function checkAuth(): Promise<void> {
    Logger.info("USER", "Fetching user information.");

    async function start(): Promise<void> {
        const bfApi = await get("https://rest-bf.blox.land/user");

        if (bfApi.success) {
            const baseBet = +(+bfApi.user.wallet.toFixed(2) / Math.pow(2, config.bet.tries)).toFixed(2);

            if (baseBet === 0) {
                return Logger.error("USER", "Tries in config is too high causing the bet to be 0", true);
            }

            Logger.log("USER",
                `${chalk.bold("Successfully logged in!")} \nUsername: ${bfApi.user.robloxUsername} \nID: ${bfApi.user.robloxId} \nBalance: ${+bfApi.user.wallet.toFixed(2)} R$`,
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
                                "value": bfApi.user.robloxUsername,
                                "inline": true
                            },
                            {
                                "name": "Roblox ID",
                                "value": bfApi.user.robloxId,
                                "inline": true
                            },
                            {
                                "name": "Balance",
                                "value": `${+bfApi.user.wallet.toFixed(2)} R$`,
                                "inline": true
                            },
                            {
                                "name": "Bet",
                                "value": `**Tries: **${config.bet.tries}\n**Base Bet: **${baseBet}`,
                                "inline": true
                            },
                            {
                                "name": "Modules",
                                "value": `**Rain: **${config.modules.rain.enabled}, ${config.modules.rain.minimum} R$\n**Analytics: **${config.modules.analytics}`,
                                "inline": true
                            }
                        ],
                        "footer": {
                            "text": "bloxflip-autocrash"
                        },
                        "thumbnail": {
                            "url": `https://www.roblox.com/headshot-thumbnail/image?userId=${bfApi.user.robloxId}&width=720&height=720`
                        }
                    }
                ]
            });
        } else {
            Logger.error("TOKEN", "Invalid token provided, please put a valid token into the config.", true);
        }

    } await start();
}

export { checkAuth };
