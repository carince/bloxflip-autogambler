import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { Browser, Page } from "puppeteer";
import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { sleep } from "@utils/sleep.js";

let page: Page;

async function startBrowser(): Promise<void> {
    await sleep(1000);

    puppeteer.default.use(stealthPlugin());
    const browser: Browser = await puppeteer.default.launch(
        {
            headless: config.debugging.headless,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                "--start-maximized", "--single-process"
            ]
        }
    );
    Logger.info("BROWSER", "Successfully started browser");

    page = (await browser.pages())[0];
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44");
    await page.goto("http://localhost:6580/", { timeout: 0 });

    await page.evaluate((config) => {
        const browserConfig = {
            auth: config.auth,
            bet: {
                tries: config.bet.tries,
                custom: config.bet.custom,
                multiplier: config.bet.multiplier
            },
            rain: {
                enabled: config.modules.rain.enabled,
                minimum: config.modules.rain.minimum
            }
        };

        localStorage.setItem("BFAC_config", JSON.stringify(browserConfig));
    }, config);

    Logger.info("BLOXFLIP", "Successfully set up page for Bloxflip");
}

export { startBrowser, page };
