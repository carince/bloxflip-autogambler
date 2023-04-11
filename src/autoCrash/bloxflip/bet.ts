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

    game.wallet = Math.round((bfApi.user.wallet + Number.EPSILON) * 100) / 100;

    if (won) {
        game.bet = game.wallet / Math.pow(2, parseFloat(`${config.tries}`));
        game.bet = Math.round((game.bet + Number.EPSILON) * 100) / 100;
    } else {
        game.bet = game.bet * 2;
    }
}

export { calculateBet };
