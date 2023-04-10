import pup from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { Browser, Page } from "puppeteer";
import { config } from "./config.js";
import { Logger } from "./logger.js";
import { sleep } from "./sleep.js";

let page: Page;

async function initialize(): Promise<Page> {
    await sleep(1000);

    pup.default.use(stealthPlugin());
    const browser: Browser = await pup.default.launch(
        {
            headless: config.debugging.headless,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                "--start-maximized"
            ]
        }
    );
    Logger.info("BROWSER", "Successfully started browser");

    page = (await browser.pages())[0];
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44");

    const auth = config.auth;
    await page.evaluate((auth: string) => {
        localStorage.setItem("BloxflipWSToken", auth);
    }, auth);

    Logger.info("BLOXFLIP", "Successfully set up page for Bloxflip");
    return page;
}

export { initialize };