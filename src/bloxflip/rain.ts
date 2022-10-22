import notifier from "node-notifier";
import { Logger } from "../utils/logger.js";
import { sendWh } from "../utils/webhook.js";
import { config } from "../utils/config.js";
import { get } from "../utils/pfetch.js";

async function startRain(): Promise<void> {
    Logger.info("RAIN", "\tStarting rain notifier.");

    let notified = false;
    async function start(): Promise<void> {
        new Promise((): void => {
            setTimeout(async (): Promise<void> => {
                const bfApi = await get("https://rest-bf.blox.land/chat/history");
                
                function pingId() {
                    const idLength = config.webhook.modules.rain.ping_id.length
                    if (idLength === 18 || idLength === 19) {
                        return `<@${config.webhook.modules.rain.ping_id}>`
                    } else {
                        return ""
                    }
                }
                
                if (bfApi.rain.active) {
                    if (!notified) {
                        if (bfApi.rain.prize >= config.webhook.modules.rain.minimum) {
                            if (config.webhook.modules.rain.os_notifs) {
                                notifier.notify({
                                    title: "AutoCrash Rain Notifier",
                                    message: `Robux: ${bfApi.rain.prize} R$ \nHost: ${bfApi.rain.host} \nTime Remaining: ${bfApi.rain.duration / 60000} minutes`,
                                    subtitle: "bloxflip-autocrash",
                                    sound: true
                                });
                            }

                            sendWh({
                                "content": pingId(),
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
