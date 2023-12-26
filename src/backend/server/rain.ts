import { data } from "@bf/data.js";
import { socket } from "./server.js";
import { sendWh } from "@utils/pfetch.js";
import notifier from "node-notifier";
import { config } from "@utils/config.js";
import open from "open";

type RainInfo = {
    duration: string,
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
                message: `Robux: ${rain.prize} R$ \nHost: ${rain.host} \nTime Remaining: ${parseInt(rain.duration) / 60000} minutes`,
                subtitle: "bloxflip-autocrash",
                sound: true,
                wait: false
            }, (err, response) => {
                if (response == "activate") open("https://bloxflip.com/");
                if (err) { /* fail silently */ }
            });
        }

        if (rainConfig.notifications.webhook.enabled) {
            sendWh({
                "content": `${config.rain.notifications.webhook.ping_id}\n# Bloxflip Rain Notifier\n**Prize: **${rain.prize} R$\n**Host: **${rain.host}\n**Time Remaining: **<t:${Math.ceil((Date.now() + parseInt(rain.duration)) / 1000)}:R>`,
            }, config.rain.notifications.webhook.link);
        }
    }
}

export { handleRain, sendRains };
