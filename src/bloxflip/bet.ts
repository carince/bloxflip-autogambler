import { page } from "../index";
import { config } from "../utils/config";
import { Logger } from "../utils/logger";

async function bet(won: boolean) {
    const inputBox = await page.$("input.input_input__uGeT_.input_inputWithCurrency__sAiOQ");

    let bet = 0.01; 
    const balance = await page.$eval("div.header_headerUserBalance__UEAJq", e => e.textContent);
    const prevBet = await inputBox?.evaluate(e => e.getAttribute("value"));

    if (won) {
        bet = parseFloat(balance!) / Math.pow(2, config.tries);
        Logger.info("BET", `\tDividing balance to 2^${config.tries}`);
    } else {
        bet = parseFloat(prevBet!) * 2;
        Logger.info("BET", "\tMultiplying previous bet to 2");
    }

    bet = Math.round((bet + Number.EPSILON) * 100) / 100;

    if (bet > parseFloat(balance!)) {
        Logger.error("BET", "\tGAME OVER. WIPED");
        process.exit();
    }

    Logger.log("BET", `\tBet: ${bet} R$, Balance: ${balance} R$`);
    
    async function clear() {
        await inputBox?.click({ clickCount: 3 });
        await inputBox?.press("Backspace");

        const currentValue = await inputBox?.evaluate(e => e.getAttribute("value"));
        if (currentValue?.length) {
            Logger.warn("BET", "\tclear: Unable to clear inputBox, trying again...");
            await sleep(500);
            await clear();
        }

        Logger.info("CLEAR", "Successfully cleared inputBox");
    } await clear();

    async function typeBet() {
        await inputBox?.type(bet.toString());

        const currentValue = await inputBox?.evaluate(e => e.getAttribute("value"));
        if (currentValue !== bet.toString()) {
            Logger.warn("BET", `\ttypeBet: Expected ${bet}, got ${currentValue} \nClearing the input box and trying again.`);
            await sleep(500);
            await clear();
            await typeBet();
        }

        Logger.info("TYPEBET", "Successfully typed bet into inputBox");
    } await typeBet();

    async function join() {
        let tries = 1;

        async function click() {
            if (tries <= 5) {
                const betBtn = await page.$("div.gameBlock.gameBet.crash_crashBet__D5Rs_ > button");
                let textContent = await betBtn?.evaluate(e => e.textContent);

                if (textContent?.includes("Join")) {
                    await betBtn?.type("\n");
                    await sleep(1000);

                    const tries = 1;
                    async function check() {
                        if (tries <= 5) {
                            textContent = await betBtn?.evaluate(e => e.textContent);
                            if (textContent == "Cashout" || "Cancel bet") {
                                Logger.log("BET", "\tSuccessfully joined game.");
                            } else {
                                Logger.warn("BET", `\tUnable to join game: ${textContent}, trying again...`);
                                await sleep(1000);
                            }
                        } else {
                            Logger.error("BET", "\tUnable to join game after 5 tries.");
                        }
                    }
                    await check();
                } else {
                    if (textContent === "Cashout" || "Cancel bet") {
                        Logger.warn("BET", "\tAlready joined this game, ignoring...");
                    } else {
                        Logger.warn("BET", `\tBet button does not include 'Join': ${textContent}, trying again...`);
                        tries++;
                        await sleep(1000);
                        await click();
                    }
                }
            } else {
                Logger.error("BET", "\tUnable to join game after 5 tries.");
            }
        }
        await click();
    }
    await join();
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export { bet };
