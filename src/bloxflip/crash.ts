import { page } from '../index';
import { bet } from './bet';
import { Logger } from '../utils/logger';
import { checkAuth } from './user';
import { getInfo } from './data'

let gameLoss = 0
let gameWon = 0
let gameCount = 0

async function startCrash() {
    await checkAuth();

    await getInfo()

    await page.waitForNetworkIdle({ timeout: 60000 });

    const elementArr = [`div.gameBlock.gameBet.crash_crashBet__D5Rs_ > button`, `input.input_input__uGeT_.input_inputWithCurrency__sAiOQ`, `div.header_headerUserBalance__UEAJq`, `div.crash_crashGameCoefficient__M8rxs`, `input.input_input__uGeT_`];
    for (const element of elementArr) {
        if (!await page.$(element)) {
            Logger.error(`ELEMENTS`, `Unable to query the element: ${element}`);
        }
    }
    Logger.info(`ELEMENTS`, `Queried all elements.`);

    const betMulti = (await page.$$(`input.input_input__uGeT_`))[1];
    await betMulti.type(`2`);

    Logger.info(`CRASH`, `Starting crash bot`);

    let cashed = false;
    let lossStreak = 0;

    async function start() {
        new Promise(() => {
            setTimeout(async () => {
                const textContent = await page.$eval(`div.crash_crashGameCoefficient__M8rxs`, e => e.textContent);
                const className = await page.$eval(`div.crash_crashGameCoefficient__M8rxs`, e => e.className);

                if (textContent?.includes(`+`)) {
                    if (className.includes(`isCrashed`)) {
                        cashed = false;
                        gameLoss++;
                        gameCount++;
                        lossStreak++;
                        Logger.log(`CRASH`, `Status: Lost \n `);
                        Logger.log(`GAME`, `\tGame #${gameCount}`);
                        Logger.log(`GAME`, `\tLoss Streak: ${lossStreak}`);
                        await sleep(3000);
                        await bet(false);
                    }

                    if (className.includes(`isCashed`)) {
                        if (!cashed) {
                            cashed = true;
                            gameWon++;
                            gameCount++;
                            lossStreak = 0;
                            Logger.log(`CRASH`, `Status: Won \n `);
                            Logger.log(`GAME`, `\tGame #${gameCount}`);
                            await sleep(3000);
                            await bet(true);
                        }
                    } else {
                        cashed = false;
                    }
                } else {
                    if (className.includes(`isCrashed`)) {
                        Logger.warn(`CRASH`, `Haven't joined this game, ignoring...`);
                        if (lossStreak) {
                            Logger.warn(`CRASH`, `Continuing loss streak, getting wiped is possible.`);
                            await sleep(3000);
                            await bet(false);
                        } else {
                            await sleep(3000);
                            await bet(true);
                        }
                    }
                }

                await start();
            }, 500);
        });
    } await start();
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export { startCrash, gameLoss, gameWon, gameCount };
