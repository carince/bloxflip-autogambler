import { browser } from "@utils/browser.js";
import { config } from "@utils/config.js";
import { socketDisconnectReasons, USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import sleep from "@utils/sleep.js";
import axios from "axios";

export default async function connectChat(manager: any) {
    const socket = manager.socket("/chat");

    socket.on("connect", () => {
        Logger.info("SOCKET/CHAT", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    }).open();

    socket.on("disconnect", (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/CHAT", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("rain-state-changed", async (data: any) => {
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
        if (config.rain.notifications.webhook.enabled) {
            try {
                axios.post(config.rain.notifications.webhook.link, {
                    content: `${config.rain.notifications.webhook.ping_id}\n# Bloxflip Rain Notifier\n**Prize: **${data.prize} R$\n**Host: **${data.host}\n**Time Remaining: **<t:${Math.ceil((new Date().getTime() + data.timeLeft) / 1000)}:R>`,
                });
            } catch (err) {
                Logger.error("RAIN/WEBHOOK", `Posting to webhook failed.\nError: ${err}`);
                return;
            }
        }

        if (config.rain.autojoin) {
            try {
                const page = await browser.newPage();
                await page.setUserAgent(USER_AGENT);
                await page.goto("https://bloxflip.com", { timeout: 0 });

                await page.waitForSelector("aside > div:nth-child(4) > p:nth-child(3)", { visible: true, timeout: 0 });
                await page.click("aside > div:nth-child(4) > p:nth-child(3)");
                await page.waitForResponse(
                    (res: any) => res.url().includes("https://api.hcaptcha.com/checkcaptcha") && res.ok(),
                    { timeout: 0 },
                );

                await sleep(10000);
                await page.close();
                Logger.info("RAIN/JOIN", "Successfully joined rain.");
            } catch (err) {
                Logger.error("RAIN/JOIN", `Error occured joining rain:\n${err}`);
            }
        }
    });
}
