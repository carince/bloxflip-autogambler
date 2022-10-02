import { curly as curl } from "node-libcurl";
import { page } from "../index";
import { config } from "../utils/config";
import { Logger } from "../utils/logger";

async function bet(won: boolean) {
    const inputBox = await page.$("input.input_input__uGeT_.input_inputWithCurrency__sAiOQ");
    let calcBet: number;
    let balance: number;

    async function calculate() {
        const bfApi = await curl.get("https://rest-bf.blox.land/user",
            {
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
                sslVerifyPeer: false,
                httpHeader: [`x-auth-token: ${config.auth}`]
            }
        );

        if (bfApi.statusCode !== 200) {
            Logger.warn("DATA", `\nFetching user info failed, possibly blocked by cloudflare. Code: ${bfApi.statusCode}`);
            if (bfApi.statusCode == 403) {
                Logger.error("BET", `\tFetching user info failed, blocked by cloudflare. Code: ${bfApi.statusCode}`, true);
            } else {
                Logger.warn("BET", `\tFetching user info failed, Code: ${bfApi.statusCode}. trying again...`);
                await sleep(500);
                await calculate();
            }
            return;
        } else {
            balance = Math.round((bfApi.data.user.wallet + Number.EPSILON) * 100) / 100;
        }

        const prevBet = await inputBox?.evaluate(e => e.getAttribute("value"));

        if (won) {
            calcBet = balance / Math.pow(2, config.tries);
            Logger.info("BET", `\tDividing balance to 2^${config.tries}`);
        } else {
            calcBet = parseFloat(prevBet!) * 2;
            Logger.info("BET", "\tMultiplying previous bet to 2");
        }

        calcBet = Math.round((calcBet + Number.EPSILON) * 100) / 100;

        if (calcBet == 0) {
            Logger.error("BET", "\tTries in config is too high causing the bet to be 0.", true);
        }

        Logger.log("BET", `\tBet: ${calcBet} R$, Balance: ${balance} R$`);

        if (calcBet > balance) {
            Logger.error("BET", "\tBet is greater than balance, wiped.");
            return bet(true);
        }
    } await calculate();

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
        await inputBox?.type(calcBet.toString());

        const currentValue = await inputBox?.evaluate(e => e.getAttribute("value"));
        if (currentValue !== calcBet.toString()) {
            Logger.warn("BET", `\ttypeBet: Expected ${calcBet}, got ${currentValue} \nClearing the input box and trying again.`);
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

                    textContent = await betBtn?.evaluate(e => e.textContent);
                    if (textContent == "Cashout" || textContent == "Cancel bet") {
                        Logger.log("BET", "\tSuccessfully joined game.");
                    } else {
                        Logger.warn("BET", `\tUnable to join game: ${textContent}`);
                        await sleep(1000);
                    }
                } else {
                    if (textContent == "Cashout" || textContent == "Cancel bet") {
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
        } await click();
    } await join();
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export { bet };
