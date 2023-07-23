import { config } from "../utils/config.js";
import { game } from "./crash.js";

async function calculateBet(won: boolean) {
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
