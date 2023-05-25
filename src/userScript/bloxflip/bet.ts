import { config } from "../utils/config.js";
import { game } from "./crash.js";

async function calculateBet(won: boolean) {
    const headers: HeadersInit = new Headers();
    headers.set("x-auth-token", `${config.auth}`); 

    const bfApi = await fetch("https://api.bloxflip.com/user", {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        headers: headers,
    }).then(res => {
        return res.json();
    });

    game.wallet = +bfApi.user.wallet.toFixed(2);

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

export { calculateBet };
