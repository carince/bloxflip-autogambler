import { notify } from "node-notifier";
import { curly as curl } from "node-libcurl";
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
                const bfApi = await curl.get("https://rest-bf.blox.land/chat/history",
                    {
                        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
                        sslVerifyPeer: false,
                    }
                );

                let bfRes;
                if (bfApi.statusCode !== 200) {
                    if (bfApi.statusCode == 403) {
                        Logger.error("RAIN", `\tFetching chat history failed, blocked by cloudflare. Code: ${bfApi.statusCode}`, true);
                    } else {
                        Logger.warn("RAIN", `\tFetching chat history failed, Code: ${bfApi.statusCode}. trying again...`);
                        await sleep(500);
                        await start();
                    }
                } else {
                    bfRes = bfApi.data;
                }

                if (bfRes.rain.active) {
                    if (!notified) {
                        const rbxApi = await curl.get(`https://api.roblox.com/users/get-by-username?username=${bfRes.rain.host}`,
                            {
                                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
                                sslVerifyPeer: false
                            }
                        );

                        let hostId: number;
                        if (rbxApi.statusCode !== 200) {
                            if (rbxApi.statusCode == 403) {
                                Logger.error("RAIN", `\tFetching roblox ID failed, blocked by cloudflare. Code: ${rbxApi.statusCode}`, true);
                            } else {
                                Logger.warn("RAIN", `\tFetching roblox ID failed, Code: ${rbxApi.statusCode}. trying again...`);
                                await sleep(500);
                                await start();
                            }
                            return
                        } else {
                            hostId = bfRes.Id;
                        }

                        if (bfRes.rain.prize >= config.webhook.modules.rain.minimum) {
                            notify({
                                title: "AutoCrash Rain Notifier",
                                message: `Robux: ${bfRes.rain.prize} R$ \nHost: ${bfRes.rain.host} \nTime Remaining: ${bfRes.rain.duration / 60000} minutes`,
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
                                                "value": `${bfRes.rain.prize} R$`,
                                                "inline": true
                                            },
                                            {
                                                "name": "Host",
                                                "value": bfRes.rain.host,
                                                "inline": true
                                            },
                                            {
                                                "name": "Time Remaining",
                                                "value": `${bfRes.rain.duration / 60000} minutes`,
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
            }, 1000);
        });
    } await start();
}

export { startRain };
