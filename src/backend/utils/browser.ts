import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { Browser, Page } from "puppeteer";
import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { sleep } from "@utils/sleep.js";
import { USER_AGENT } from "@utils/constants.js";

let page: Page;

async function startBrowser(): Promise<void> {
    await sleep(1000);

    puppeteer.default.use(stealthPlugin());
    const browser: Browser = await puppeteer.default.launch(
        {
            headless: config.debugging.headless,
            defaultViewport: { width: 1920, height: 1080 },
            args: config.debugging.launch_options
        }
    );
    Logger.info("BROWSER", "Successfully started browser");

    page = (await browser.pages())[0];
    await page.setUserAgent(USER_AGENT);
    await page.goto("http://localhost:6580/", { timeout: 0 });

    Logger.info("BLOXFLIP", "Successfully set up page for Bloxflip");
}

export { startBrowser, page };
