import notifier from "node-notifier";
import { sendWh } from "@utils/pfetch.js";
import { config } from "@utils/config.js";
import { data } from "@bf/data.js";
import { Request, Response } from "express";

async function notifyRain(req: Request, res: Response): Promise<void> {
    const { rain }: any = req.body!;

    const date = new Date();

    data.pushRain({
        prize: rain.prize,
        host: rain.host,
        time: date.getTime()
    });

    const rainConfig = config.modules.rain;

    if (rain.prize >= rainConfig.minimum) {
        if (rainConfig.notifications.os_notifs) {
            notifier.notify({
                title: "Bloxflip Rain Notifier",
                message: `Robux: ${rain.prize} R$ \nHost: ${rain.host} \nTime Remaining: ${rain.duration / 60000} minutes`,
                subtitle: "bloxflip-autocrash",
                sound: true,
                wait: false
            });
            // TODO: Open website when notification is clicked.
            // }, (err, response) => {
            //     open("https://bloxflip.com/");
            // });
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

function pingId() {
    const rainConfig = config.modules.rain;
    const idLength = rainConfig.notifications.webhook.ping_id.length;
    if (idLength === 18 || idLength === 19) {
        return `<@${rainConfig.notifications.webhook.ping_id}>`;
    } else {
        return "";
    }
}

export { notifyRain };
