import { config } from "@utils/config.js";
import { __dirname, USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import { join } from "path";
import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

let browser: Browser;

async function startBrowser(): Promise<void> {
    if (config.rain.enabled && config.rain.autojoin.enabled) return;

    try {
        puppeteer.default.use(stealthPlugin());
        const pathToExtension = join(__dirname, "..", "..", "lib", "nopecha");
        const pup = await puppeteer.default.launch(
            {
                headless: config.debugging.headless,
                defaultViewport: { width: 1920, height: 1080 },
                args: [
                    "--start-maximized", "--single-process",
                    `--disable-extensions-except=${pathToExtension}`,
                    `--load-extension=${pathToExtension}`,
                ],
            },
        );
        Logger.info("BROWSER", "Successfully started browser");

        const page = await pup.newPage();
        await page.setUserAgent(USER_AGENT);
        await page.goto("https://bloxflip.com", { timeout: 0, waitUntil: "domcontentloaded" });
        await page.evaluate((auth: string) => {
            localStorage.setItem("_DO_NOT_SHARE_BLOXFLIP_TOKEN", auth);
        }, config.auth);
        await page.close();

        Logger.info("BROWSER", "Successfully set up page for Bloxflip");

        browser = pup;
    } catch (e) {
        Logger.error("BROWSER", e instanceof Error ? e.message : `Unknown error.\n${e}`, { forceClose: true });
        throw e;
    }
}

export { browser, startBrowser };
