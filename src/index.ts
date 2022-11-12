import { Page } from "puppeteer";
import { startCrash } from "./bloxflip/crash.js";
import { checkAuth } from "./bloxflip/user.js";
import { getInfo } from "./bloxflip/data.js";
import { startRain } from "./bloxflip/rain.js";
import { fetchCfg, config } from "./utils/config.js";
import { Logger } from "./utils/logger.js";
import { initialize } from "./utils/browser.js";
import { updater } from "./utils/updater.js";
let page: Page;

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");
    
    await fetchCfg();
    await updater();

    page = await initialize();

    Logger.info("BLOXFLIP", "Waiting for network idle...");
    await page.waitForNetworkIdle({ timeout: 60000 });

    await checkAuth();
    await getInfo();
    if (config.webhook.modules.rain.enabled) startRain();

    const elementArr: string[] = ["div.crash_buttonWrapper__1ceLh > button", "input.input_input__uGeT_.input_inputWithCurrency__sAiOQ", "div.header_headerUserBalance__UEAJq", "div.crash_crashGameCoefficient__M8rxs", "input.input_input__uGeT_"];
    for (const element of elementArr) {
        if (!await page.$(element)) {
            Logger.error("ELEMENTS", `Unable to query element: ${element}`, true);
        }
    }
    Logger.info("ELEMENTS", "Queried all elements.");

    const betMulti = (await page.$$("input.input_input__uGeT_"))[1];
    await betMulti.type("2");

    await startCrash();
})();

export { page };
