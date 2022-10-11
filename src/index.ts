import { Page } from "puppeteer";
import { startCrash } from "./bloxflip/crash";
import { checkAuth } from "./bloxflip/user";
import { getInfo } from "./bloxflip/data";
import { startRain } from "./bloxflip/rain";
import { config } from "./utils/config";
import { Logger } from "./utils/logger";
import { sleep } from "./utils/sleep";
import { initialize } from "./utils/browser";
import { updater } from "./utils/updater";
let page: Page;

(async (): Promise<void> => {
    await updater();

    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/Norikiru/bloxflip-autocrash");

    await sleep(1000);

    page = await initialize();

    Logger.info("BLOXFLIP", "Waiting for network idle...");
    await page.waitForNetworkIdle({ timeout: 60000 });

    await checkAuth();
    await getInfo();
    if (config.webhook.modules.rain.enabled) startRain();

    const elementArr: string[] = ["div.gameBlock.gameBet.crash_crashBet__D5Rs_ > button", "input.input_input__uGeT_.input_inputWithCurrency__sAiOQ", "div.header_headerUserBalance__UEAJq", "div.crash_crashGameCoefficient__M8rxs", "input.input_input__uGeT_"];
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
