import { user } from "@bf/user.js";
import { config } from "@utils/config.js";

async function calculateBet() {
    let bet: number;
    const dividend: number = config.bet.game === "crash" ? config.bet.crash_autocashout : 2;
    if (config.bet.starting_bet) {
        bet = config.bet.starting_bet;
    } else {
        bet = user.balance / Math.pow(dividend, config.bet.tries);
    }
    return +(bet).toFixed(2);
}

export { calculateBet };
