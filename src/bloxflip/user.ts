import chalk from "chalk";
import { Logger } from "../utils/logger.js";
import { sendWh } from "../utils/webhook.js";
import { get } from "../utils/pfetch.js";
import { config } from "../utils/config.js";

async function checkAuth(): Promise<void> {
    Logger.info("USER", "\tFetching user information.");

    async function start(): Promise<void> {
        const res = await get("https://rest-bf.blox.land/user");

        if (res.success) {
            const baseBet = Math.round(((Math.round((res.user.wallet + Number.EPSILON) * 100) / 100) / Math.pow(2, config.tries) + Number.EPSILON) * 100) / 100
            
            if (baseBet === 0) {
                return Logger.error("USER", "\tTries in config is too high causing the bet to be 0", true);
            }

            Logger.log("USER", `\t${chalk.bold("User Information")} \n\t\tUsername: ${res.user.robloxUsername} \n\t\tID: ${res.user.robloxId}\n\t\tBalance: ${Math.round((res.user.wallet + Number.EPSILON) * 100) / 100} R$`);
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
                                "value": `**Rain: **${config.webhook.modules.rain.enabled}, ${config.webhook.modules.rain.minimum} R$\n**Analytics: **${config.webhook.modules.analytics}`,
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
