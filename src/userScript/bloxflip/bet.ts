import { config } from "../utils/config.js";
import { game } from "./crash.js";

async function getUserInfo(update?: boolean) {
    const headers: HeadersInit = new Headers();
    headers.set("x-auth-token", `${config.auth}`); 

    const bfApi = await fetch("https://rest-bf.blox.land/user", {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        headers: headers,
    }).then(res => {
        return res.json();
    });

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
            return Logger.error("BET", `Fetching user data failed. \nCode: ${bfApi.status} \nBody: ${await bfApi.text()}`, { forceClose: update ? false : true });
        }
    } catch (e) {
        return Logger.error("BET", `Fetching user data failed. \nError: ${e}`, { forceClose: update ? false : true });
    }

    game.balance = +(+bfApi.user.wallet.toFixed(2) + +bfApi.user.bonusWallet.toFixed(2)).toFixed(2);
}

async function calculateBet(won: boolean) {
    if (won) {
        if (config.bet.custom) {
            game.bet = config.bet.custom;
        } else {
            game.bet = game.wallet / Math.pow(config.bet.multiplier, config.bet.tries);
        }
        game.bet = +game.bet.toFixed(2);
    } else {
        game.bet = game.bet * 2;
    }
}

export { calculateBet, getUserInfo };
