// eslint-disable-next-line
import { Manager, Socket } from "socket.io-client/dist/socket.io.dev.js";
import { RainStateChangedData } from "@utils/types.js";
import { socketDisconnectReasons } from "../utils/constants.js";
import { config } from "../utils/config.js";
import Logger from "../utils/logger.js";

export let socket: Socket;

async function sendWebhook(content: string) {
    try {
        if (!config.rain.notifications.enabled) return;
        fetch(config.rain.notifications.link, {
            method: "post",
            body: content,
        });
    } catch (err) {
        Logger.error("RAIN/WEBHOOK", `Posting to webhook failed.\nError: ${err}`);
    }
}

export default async function connectChat(manager: Manager) {
    socket = manager.socket("/chat").open();

    socket.on("connect", async () => {
        Logger.info("SOCKET/CHAT", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    });

    socket.on("disconnect", async (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/CHAT", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("rain-state-changed", async (data: RainStateChangedData) => {
        if (!data.active) {
            Logger.log("RAIN", "Rain ended!");
            return;
        }

        const logData = `Robux: ${data.prize} R$\nHost: ${data.host}\nTime Remaining: ${data.timeLeft / 60000} minute(s)`;

        if (data.prize < config.rain.minimum) {
            Logger.log("RAIN", `Rain detected!\nNot notifying cause it does not meet minimum\n${logData}`);
            return;
        }

        Logger.log("RAIN", `Rain detected!\n${logData}`);
        await sendWebhook(`${config.rain.notifications.ping_id}\n# Bloxflip Rain Notifier\n**Prize: **${data.prize} R$\n**Host: **${data.host}\n**Time Remaining: **<t:${Math.ceil((new Date().getTime() + data.timeLeft) / 1000)}:R>`);
    });
}
