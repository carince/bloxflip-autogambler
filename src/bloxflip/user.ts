import chalk from "chalk";
import { Logger } from "@utils/logger.js";
import { sendWh } from "@utils/webhook.js";
import { get } from "@utils/pfetch.js";
import { config } from "@utils/config.js";

async function checkAuth(): Promise<void> {
    Logger.info("USER", "Fetching user information.");

    async function start(): Promise<void> {
        const res = await get("https://rest-bf.blox.land/user");

        if (res.success) {
            const baseBet = Math.round(((Math.round((res.user.wallet + Number.EPSILON) * 100) / 100) / Math.pow(2, config.tries) + Number.EPSILON) * 100) / 100;

            if (baseBet === 0) {
                return Logger.error("USER", "Tries in config is too high causing the bet to be 0", true);
            }

            Logger.log("USER",
                `${chalk.bold("Successfully logged in!")} \nUsername: ${res.user.robloxUsername} \nID: ${res.user.robloxId} \nBalance: ${Math.round((res.user.wallet + Number.EPSILON) * 100) / 100} R$`,
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
                                "value": res.user.robloxUsername,
                                "inline": true
                            },
                            {
                                "name": "Roblox ID",
                                "value": res.user.robloxId,
                                "inline": true
                            },
                            {
                                "name": "Balance",
                                "value": `${Math.round((res.user.wallet + Number.EPSILON) * 100) / 100} R$`,
                                "inline": true
                            },
                            {
                                "name": "Bet",
                                "value": `**Tries: **${config.tries}\n**Base Bet: **${baseBet}`,
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
                            "url": `https://www.roblox.com/headshot-thumbnail/image?userId=${res.user.robloxId}&width=720&height=720`
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
