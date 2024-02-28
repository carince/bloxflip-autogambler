import { user } from "@bf/user.js";
import { config } from "@utils/config.js";

async function calculateBet() {
    let bet: number;
    let dividend: number = config.bet.game === "crash" ? config.bet.crash_auto_cashout : 2
    if (config.bet.starting_bet) {
        bet = config.bet.starting_bet;
    } else {
        bet = user.balance / Math.pow(dividend, config.bet.tries);
    }
    return +(bet).toFixed(2);
}

export { calculateBet };
