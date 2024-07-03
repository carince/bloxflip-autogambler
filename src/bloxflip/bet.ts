import { user } from "@bf/user.js";
import { config } from "@utils/config.js";

export default async function calculateBet() {
    let bet: number;
    if (config.starting_bet) {
        bet = config.starting_bet;
    } else {
        bet = user.balance / config.autocashout ** config.tries;
    }
    return +(bet).toFixed(2);
}
