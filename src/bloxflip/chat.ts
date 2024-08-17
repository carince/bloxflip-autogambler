import { browser } from "@utils/browser.js";
import { config } from "@utils/config.js";
import { socketDisconnectReasons, USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import sleep from "@utils/sleep.js";
import { RainStateChangedData } from "@utils/types.js";
import axios from "axios";
import { HTTPResponse } from "puppeteer";
import { Manager, Socket } from "socket.io-client";

const rainButton = "p.chat_chatBannerJoinButton__avNuN";

export let socket: Socket;

async function sendWebhook(content: string) {
    try {
        if (!config.rain.notifications.enabled) return;
        axios.post(config.rain.notifications.link, {
            content,
        });
    } catch (err) {
        Logger.error("RAIN/WEBHOOK", `Posting to webhook failed.\nError: ${err}`);
    }
}

export default async function connectChat(manager: Manager) {
    socket = manager.socket("/chat");

    socket.on("connect", async () => {
        Logger.info("SOCKET/CHAT", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    }).open();

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

        if (config.rain.autojoin) {
            try {
                const timeout = new Date().getTime() + data.timeLeft;

                const page = await browser.newPage();
                await page.setUserAgent(USER_AGENT);
                await page.goto("https://bloxflip.com", { timeout: 0 });

                await page.waitForSelector(rainButton, { visible: true, timeout: 0 });
                await page.click(rainButton);

                await page.waitForResponse(
                    (res: HTTPResponse) => (res.url().includes("https://api.hcaptcha.com/checkcaptcha") && res.ok()),
                    { timeout: 0 },
                );
                await sleep(1000);
                await page.close();

                if (new Date().getTime() > timeout) throw new Error("Rain ended before we can join.");
                Logger.info("RAIN/JOIN", "Successfully joined rain.");
                await sendWebhook("Successfully joined rain!");
            } catch (err) {
                Logger.error("RAIN/JOIN", `Error occured joining rain:\n${err}`);
            }
        }
    });
}
