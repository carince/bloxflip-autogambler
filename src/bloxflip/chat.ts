import axios from "axios";
import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { analytics } from "@utils/analytics.js";
import { socketDisconnectReasons } from "@utils/constants.js";

async function connectChatSocket(manager: any) {
    if (!config.rain.enabled) return;

    const socket = manager.socket("/chat");

    socket.on("connect", () => {
        Logger.info("SOCKET/CHAT", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    }).open();

    socket.on("disconnect", (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/CHAT", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("rain-state-changed", async (data: any) => {
        if (!data.active) return;

        analytics.appendRain({ host: data.host, prize: data.prize, time: new Date().getTime() });

        if (data.prize < config.rain.minimum) {
            return Logger.log("RAIN", `Rain detected!\nNot notifying cause it does not meet minimum\nRobux: ${data.prize} R$\nHost: ${data.host}\nTime Remaining: ${data.timeLeft / 60000} minute(s)`);
        }

        Logger.log("RAIN", `Rain detected!\nRobux: ${data.prize} R$\nHost: ${data.host}\nTime Remaining: ${data.duration / 60000} minute(s)`);
        if (config.rain.notifications.webhook.enabled) {
            try {
                axios.post(config.rain.notifications.webhook.link, {
                    "content": `${config.rain.notifications.webhook.ping_id}\n# Bloxflip Rain Notifier\n**Prize: **${data.prize} R$\n**Host: **${data.host}\n**Time Remaining: **<t:${Math.ceil((new Date().getTime() + data.timeLeft) / 1000)}:R>`,
                });
            } catch (err) {
                return Logger.error("WEBHOOK/RAIN", `Posting to webhook failed.\nError: ${err}`);
            }
        }
    });
}

export { connectChatSocket };
