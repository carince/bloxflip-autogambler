import { ElementHandle } from "puppeteer";
import { sendWh } from "../utils/webhook";
import { page } from "../index";
import { config } from "../utils/config";
import { Logger } from "../utils/logger";
import { sleep } from "../utils/sleep";
import { balanceBefore } from "./data";

async function bet(won: boolean): Promise<void> {
    const inputBox: ElementHandle<Element> = await page.$("input.input_input__uGeT_.input_inputWithCurrency__sAiOQ") as ElementHandle<Element>;
    let calcBet: number;

    async function calculate(): Promise<void> {
        const auth = config.auth;
        const bfApi = await page.evaluate(async (auth: string) => {
            let api: any;

            try {
                api = await fetch("https://rest-bf.blox.land/user", {
                    headers: { "x-auth-token": auth }
                });
            } catch {
                return 2;
            }

            if (api.status !== 200) {
                if (api.status == 403) {
                    return 1;
                } else {
                    return 2;
                }
            } else {
                return api.json();
            }
        }, auth);

        if (bfApi == 1) {
            Logger.error("BET", "\tFetching user info failed, blocked by cloudflare.", true);
            return;
        }
        if (bfApi == 2) {
            Logger.warn("BET", "\tFetching user info failed, trying again...");
            await sleep(500);
            return await calculate();
        }

        const balance: number = Math.round((bfApi.user.wallet + Number.EPSILON) * 100) / 100;
        const prevBet: string = await inputBox?.evaluate(e => e.getAttribute("value")) as string;

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
            sendWh(
                {
                    "embeds": [
                        {
                            "title": "Wiped!",
                            "color": 3092790,
                            "fields": [
                                {
                                    "name": "Balance",
                                    "value": `**Before**: ${balanceBefore}\n**After**: ${balance}`,
                                    "inline": true
                                }
                            ],
                            "footer": {
                                "text": "bloxflip-autocrash"
                            }
                        }
                    ]
                }
            );
            return bet(true);
        }
    } await calculate();

    async function clear(): Promise<void> {
        await inputBox?.click({ clickCount: 3 });
        await inputBox?.press("Backspace");

        const currentValue: string = await inputBox?.evaluate(e => e.getAttribute("value")) as string;
        if (currentValue?.length) {
            Logger.warn("BET", "\tclear: Unable to clear inputBox, trying again...");
            await sleep(500);
            await clear();
        }

        Logger.info("CLEAR", "Successfully cleared inputBox");
    } await clear();

    async function typeBet(): Promise<void> {
        await inputBox?.type(calcBet.toString());

        const currentValue: string = await inputBox?.evaluate(e => e.getAttribute("value")) as string;
        if (currentValue !== calcBet.toString()) {
            Logger.warn("BET", `\ttypeBet: Expected ${calcBet}, got ${currentValue} \nClearing the input box and trying again.`);
            await sleep(500);
            await clear();
            await typeBet();
        }

        Logger.info("TYPEBET", "Successfully typed bet into inputBox");
    } await typeBet();

    async function join(): Promise<void> {
        let tries = 1;

        async function click(): Promise<void> {
            if (tries <= 5) {
                const betBtn: ElementHandle<Element> = await page.$("div.gameBlock.gameBet.crash_crashBet__D5Rs_ > button") as ElementHandle<Element>;
                let textContent: string = await betBtn?.evaluate(e => e.textContent) as string;

                if (textContent?.includes("Join")) {
                    await betBtn?.type("\n");
                    await sleep(1000);

                    textContent = await betBtn?.evaluate(e => e.textContent) as string;
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

export { bet };
