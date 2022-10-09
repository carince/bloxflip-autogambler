import { notify } from "node-notifier";
import { Logger } from "../utils/logger";
import { sendWh } from "../utils/webhook";
import { config } from "../utils/config";
import { get } from "../utils/pfetch";

async function startRain(): Promise<void> {
    Logger.info("RAIN", "\tStarting rain notifier.");

    let notified = false;
    async function start(): Promise<void> {
        new Promise((): void => {
            setTimeout(async (): Promise<void> => {
                const bfApi = await get("https://rest-bf.blox.land/chat/history");

                if (bfApi.rain.active) {
                    if (!notified) {
                        const rbxApi = await get(`https://api.roblox.com/users/get-by-username?username=${bfApi.rain.host}`);
                        const hostId: number = rbxApi.Id

                        if (bfApi.rain.prize >= config.webhook.modules.rain.minimum) {
                            if (config.webhook.modules.rain.os_notifs) {
                                notify({
                                    title: "AutoCrash Rain Notifier",
                                    message: `Robux: ${bfApi.rain.prize} R$ \nHost: ${bfApi.rain.host} \nTime Remaining: ${bfApi.rain.duration / 60000} minutes`,
                                    subtitle: "bloxflip-autocrash",
                                    sound: true
                                });
                            }
                            
                            sendWh({
                                "embeds": [
                                    {
                                        "title": "Bloxflip Rain Notifier",
                                        "url": "https://bloxflip.com",
                                        "color": 3092790,
                                        "fields": [
                                            {
                                                "name": "Prize",
                                                "value": `${bfApi.rain.prize} R$`,
                                                "inline": true
                                            },
                                            {
                                                "name": "Host",
                                                "value": bfApi.rain.host,
                                                "inline": true
                                            },
                                            {
                                                "name": "Time Remaining",
                                                "value": `${bfApi.rain.duration / 60000} minutes`,
                                                "inline": true
                                            }
                                        ],
                                        "footer": {
                                            "text": "bloxflip-autocrash"
                                        },
                                        "thumbnail": {
                                            "url": `https://www.roblox.com/headshot-thumbnail/image?userId=${hostId}&width=720&height=720`
                                        }
                                    }
                                ]
                            });
                        } else {
                            Logger.info("RAIN", "\tPrize is not greater or equal than the minimum value set in the config, ignoring...");
                        }

                        notified = true;
                    }
                } else {
                    notified = false;
                }

                await start();
            }, 5000);
        });
    } await start();
}

export { startRain };
