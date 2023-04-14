import notifier from "node-notifier";
import { sendWh } from "@utils/webhook.js";
import { config } from "@utils/config.js";
import { Request, Response } from "express";

async function notifyRain(req: Request, res: Response): Promise<void> {
    const { rain }: any = req.body!

    if (rain.prize >= config.webhook.modules.rain.minimum) {
        function pingId() {
            const idLength = config.webhook.modules.rain.ping_id.length;
            if (idLength === 18 || idLength === 19) {
                return `<@${config.webhook.modules.rain.ping_id}>`;
            } else {
                return "";
            }
        }

        if (config.webhook.modules.rain.os_notifs) {
            notifier.notify({
                title: "AutoCrash Rain Notifier",
                message: `Robux: ${rain.prize} R$ \nHost: ${rain.host} \nTime Remaining: ${rain.duration / 60000} minutes`,
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
                            "value": `${rain.prize} R$`,
                            "inline": true
                        },
                        {
                            "name": "Host",
                            "value": rain.host,
                            "inline": true
                        },
                        {
                            "name": "Time Remaining",
                            "value": `${rain.duration / 60000} minutes`,
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

    res.sendStatus(200)
}

export { notifyRain };
