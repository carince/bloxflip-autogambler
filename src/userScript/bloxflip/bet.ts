import { Logger } from "../utils/logger.js";
import { config } from "../utils/config.js";
import { game } from "./crash.js";

async function calculateBet(won: boolean) {
    const headers: HeadersInit = new Headers();
    headers.set("x-auth-token", `${config.auth}`);

    let bfApi;

    try {
        bfApi = await fetch("https://api.bloxflip.com/user", {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            headers: headers,
        });

        if (bfApi.ok) {
            bfApi = await bfApi.json();
        } else {
            return Logger.error("BET", `Fetching user data failed. \nCode: ${bfApi.status} \nBody: ${await bfApi.text()}`, { forceClose: true });
        }
    } catch (e) {
        return Logger.error("BET", `Fetching user data failed. \nError: ${e}`, { forceClose: true });
    }

    game.balance = +bfApi.user.wallet.toFixed(2);

    if (won) {
        if (config.bet.startingBet) {
            game.bet = config.bet.startingBet;
        } else {
            game.bet = game.balance / Math.pow(config.bet.autoCashout, config.bet.tries);
        }
        game.bet = +game.bet.toFixed(2);
    } else {
        game.bet = game.bet * 2;
    }
}

export { calculateBet };
