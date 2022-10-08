import chalk from "chalk";
import { Logger } from "../utils/logger";
import { sendWh } from "../utils/webhook";
import { config } from "../utils/config";
import { sleep } from "../utils/sleep";
import { page } from "../index";

async function checkAuth(): Promise<void> {
    Logger.info("USER", "\tFetching user information.");

    const auth = config.auth;
    const bfApi = await page.evaluate(async (auth: string) => {
        let api;

        try {
            api = await fetch("https://rest-bf.blox.land/user", {
                headers: { "x-auth-token": auth }
            });
        } catch {
            return 2;
        }

        if (api.status !== 200) {
            if (api.status == 403) {
                return 1;
            } else {
                return 2;
            }
        } else {
            return api.json();
        }
    }, auth);

    
    if (bfApi == 1) {
        Logger.error("USER", "\tFetching user info failed, blocked by cloudflare.", true);
        return;
    }
    if (bfApi == 2) {
        Logger.warn("USER", "\tFetching user info failed. trying again...");
        await sleep(500);
        return await checkAuth();
    }
    const res = bfApi;

    if (res.success) {
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

}

export { checkAuth };
