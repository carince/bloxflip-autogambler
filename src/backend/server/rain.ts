import { browser } from "@utils/browser.js";
import { config } from "@utils/config.js";
import { USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import sleep from "@utils/sleep.js";
import { RainStateChangedData } from "@utils/types.js";

const rainButton = "p.chat_chatBannerJoinButton__avNuN";

export default async function handleRain(data: RainStateChangedData) {
    if (!config.rain.autojoin.enabled) return;

    try {
        const timeout = new Date().getTime() + data.timeLeft;

        const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT);
        await page.goto("https://bloxflip.com", { timeout: 0 });

        await page.waitForSelector(rainButton, { visible: true, timeout: 0 });
        await page.click(rainButton);

        let passed = false;

        page.on("response", async (response) => {
            if (response.url().includes("api.hcaptcha.com/checkcaptcha")) {
                if (response.request().method().toUpperCase() === "OPTIONS") return;
                Logger.info("RAIN/JOIN", "Captcha results received");
                const { pass } = await response.json() as { pass: boolean };
                Logger.log("RAIN/JOIN", pass ? "Captcha passed!" : "Captcha failed!");
                if (pass) passed = true;
            }
        });

        await sleep(timeout - new Date().getTime());
        Logger.log("RAIN/JOIN", passed ? "Successfully joined rain!" : "Unable to join rain, didnt solve captcha in time.");
        await page.close();
    } catch (err) {
        Logger.error("RAIN/JOIN", `Error occured joining rain:\n${err}`);
    }
}
