import { page } from "../index.js";
import { bet } from "./bet.js";
import { Logger } from "../utils/logger.js";
import { sleep } from "../utils/sleep.js";

let gameLoss = 0;
let gameWon = 0;
let restart = 1;

async function startCrash(): Promise<void> {
    Logger.info("CRASH", "Starting crash bot");

    let cashed = false;
    let lossStreak = 0;

    async function setMulti() {
        const betMulti = (await page.$$("input.input_input__uGeT_"))[1];
        await betMulti.type("2");

        const multiValue: string = await betMulti?.evaluate(e => e.getAttribute("value")) as string;
        if (multiValue !== "2") {
            Logger.warn("BET", `\tbetMulti: Expected 2, got ${multiValue} \nClearing the input box and trying again.`);
            await sleep(500);
            await betMulti?.click({ clickCount: 3 });
            await betMulti?.press("Backspace");
            await setMulti();
        }
    } await setMulti();

    async function start(): Promise<void> {
        new Promise(async (): Promise<void> => {
            await sleep(500)

            const textContent: string = await page.$eval("div.crash_crashGameCoefficient__M8rxs", e => e.textContent) as string;
            const className = await page.$eval("div.crash_crashGameCoefficient__M8rxs", e => e.className);

            if (textContent?.includes("+")) {
                if (className.includes("isCrashed")) {
                    cashed = false;
                    gameLoss++;
                    lossStreak++;
                    Logger.log("CRASH", "Status: Lost \n ");
                    Logger.log("GAME", `\tGame #${gameLoss + gameWon}`);
                    Logger.log("GAME", `\tLoss Streak: ${lossStreak}`);
                    await sleep(3000);
                    await bet(false);
                }

                if (className.includes("isCashed")) {
                    if (!cashed) {
                        if ((gameLoss + gameWon) >= (restart * 1000)) {
                            restart++;
                            gameWon++;
                            Logger.log("CRASH", "Restarting Bloxflip...\n ");
                            await page.reload({ timeout: 60000 });
                            return await startCrash()
                        }

                        cashed = true;
                        gameWon++;
                        lossStreak = 0;
                        Logger.log("CRASH", "Status: Won \n ");
                        Logger.log("GAME", `\tGame #${gameLoss + gameWon}`);
                        await sleep(3000);
                        await bet(true);
                    }
                } else {
                    cashed = false;
                }
            } else {
                if (className.includes("isCrashed")) {
                    Logger.warn("CRASH", "Haven't joined this game, ignoring...");
                    if (lossStreak) {
                        Logger.warn("CRASH", "Continuing loss streak, getting wiped is possible.");
                        console.log("\n");
                        await sleep(3000);
                        await bet(false);
                    } else {
                        console.log("\n");
                        await sleep(3000);
                        await bet(true);
                    }
                }
            }

            await start();
        });
    } await start();
}

export { startCrash, gameLoss, gameWon };
