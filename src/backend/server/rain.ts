import { browser } from "@utils/browser.js";
import { config } from "@utils/config.js";
import { USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import { RainStateChangedData } from "@utils/types.js";
import { HTTPResponse } from "puppeteer";

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

        await page.waitForResponse(
            (res: HTTPResponse) => (res.url().includes("api.hcaptcha.com/checkcaptcha") && res.ok()),
            { timeout: data.timeLeft },
        );

        Logger.debug("we joined");

        await page.waitForSelector("::-p-xpath(//*[@id='__next']/div[3][.//text()[contains(., 'The system is now awarding R$')]])", { timeout: (timeout - new Date().getTime()) });
        await page.close();

        if (new Date().getTime() > timeout) throw new Error("Rain ended before we can join.");
        Logger.info("RAIN/JOIN", "Successfully joined rain.");
    } catch (err) {
        Logger.error("RAIN/JOIN", `Error occured joining rain:\n${err}`);
    }
}
