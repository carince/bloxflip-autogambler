import { user } from "@bf/user.js";
import { config } from "@utils/config.js";

async function calculateBet() {
    let bet: number;
    if (config.bet.starting_bet) {
        bet = config.bet.starting_bet;
    } else {
        bet = user.balance / Math.pow(config.bet.auto_cashout, config.bet.tries);
    }
    return +(bet).toFixed(2);
}

export { calculateBet };
