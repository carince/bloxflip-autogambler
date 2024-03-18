import { data } from "@bf/data.js";
import { socket } from "./server.js";
import { sendWh } from "@utils/pfetch.js";
import notifier from "node-notifier";
import { config } from "@utils/config.js";
import open from "open";

type RainInfo = {
    duration: number,
    prize: number,
    host: string
}

function sendRains(callback: (ack: any) => unknown) {
    callback(data.rains);
}


async function handleRain(rain: RainInfo) {
    const date = new Date();

    const rainInfo =  {
        host: rain.host,
        prize: rain.prize,
        time: date.getTime()
    };

    data.pushRain(rainInfo);
    socket.to("analytics").emit("new-rain", rainInfo);

    const rainConfig = config.rain;

    if (rain.prize >= rainConfig.minimum) {
        if (rainConfig.notifications.os_notifs) {
            notifier.notify({
                title: "Bloxflip Rain Notifier",
                message: `Robux: ${rain.prize} R$ \nHost: ${rain.host} \nTime Remaining: ${rain.duration / 60000} minutes`,
                subtitle: "bloxflip-autocrash",
                sound: true,
                wait: false
            }, (err, response) => {
                if (response == "activate") open("https://bloxflip.com/");
            });
        }

        if (rainConfig.notifications.webhook.enabled) {
            sendWh({
                "content": `<@${config.rain.notifications.webhook.ping_id}>`,
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
            }, config.rain.notifications.webhook.link);
        }
    }
}

export { handleRain, sendRains };
