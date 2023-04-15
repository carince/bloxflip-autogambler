import notifier from "node-notifier";
import { sendWh } from "@utils/webhook.js";
import { config } from "@utils/config.js";
import { Request, Response } from "express";

async function notifyRain(req: Request, res: Response): Promise<void> {
    const { rain }: any = req.body!;

    const rainConfig = config.modules.rain

    if (rain.prize >= rainConfig.minimum) {
        function pingId() {
            const idLength = rainConfig.notifications.webhook.ping_id.length;
            if (idLength === 18 || idLength === 19) {
                return `<@${rainConfig.notifications.webhook.ping_id}>`;
            } else {
                return "";
            }
        }

        if (rainConfig.notifications.os_notifs) {
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

    res.sendStatus(200);
}

export { notifyRain };
