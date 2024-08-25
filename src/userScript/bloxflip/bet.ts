import frmt from "@utils/number.js";

import { config } from "../utils/config.js";
import { game } from "./crash.js";

export default async function calculateBet() {
    let bet: number;
    if (config.starting_bet) {
        bet = config.starting_bet;
    } else {
        bet = game.balance / config.autocashout ** config.tries;
    }
    return frmt(bet);
}
