import { notify } from "node-notifier";
import { page } from "../index";
import { Logger } from "../utils/logger";
import { sendWh } from "../utils/webhook";
import { config } from "../utils/config";
import { sleep } from "../utils/sleep";

async function startRain(): Promise<void> {
    Logger.info("RAIN", "\tStarting rain notifier.");

    let notified = false;
    async function start(): Promise<void> {
        new Promise((): void => {
            setTimeout(async (): Promise<void> => {
                const bfApi = await page.evaluate(async () => {
                    let api: any;

                    try {
                        api = await fetch("https://rest-bf.blox.land/chat/history");
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
                });

                if (bfApi == 1) {
                    Logger.error("RAIN", "\tFetching chat history failed, blocked by cloudflare.", true);
                    return;
                }
                if (bfApi == 2) {
                    Logger.warn("BET", "\tFetching chat history failed, trying again...");
                    await sleep(500);
                    return await start();
                }

                if (bfApi.rain.active) {
                    if (!notified) {
                        const rbxApi = await page.evaluate(async () => {
                            let api: any;

                            try {
                                api = await fetch("https://rest-bf.blox.land/user");
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
                        });

                        if (rbxApi == 1) {
                            Logger.error("RAIN", "\tFetching roblox Id failed, blocked by cloudflare.", true);
                            return;
                        }
                        if (rbxApi == 2) {
                            Logger.warn("RAIN", "\tFetching roblox Id failed, trying again...");
                            await sleep(500);
                            return await start();
                        }

                        const hostId: number = rbxApi.Id;

                        if (bfApi.rain.prize >= config.webhook.modules.rain.minimum) {
                            notify({
                                title: "AutoCrash Rain Notifier",
                                message: `Robux: ${bfApi.rain.prize} R$ \nHost: ${bfApi.rain.host} \nTime Remaining: ${bfApi.rain.duration / 60000} minutes`,
                                subtitle: "bloxflip-autocrash",
                                sound: true
                            });

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
