import { bfWs } from "../utils/ws.js";
import { calculateBet } from "./bet.js";

interface gameInt {
    bet: number;
    joined: boolean;
    started: boolean;
    lossStreak: number;
    wallet: number;
}

const game: gameInt = {
    bet: 0,
    joined: false,
    started: false,
    lossStreak: 0,
    wallet: 0
};

async function crash(event: MessageEvent) {
    // Game Intermission before it starts
    if (event.data.includes("42/crash,[\"game-starting\",")) {
        if (game.bet !== 0) {
            if (game.started) {
                return console.log("[BET] Cannot place bet, game has already started.");
            }

            if (game.joined) {
                return console.log("[BET] Cannot place bet, already joined the game.");
            }

            bfWs.send(`42/crash,["join-game",{"autoCashoutPoint":200,"betAmount":${game.bet}}]`);
            console.log(`[BET] Balance: ${game.wallet}, Bet: ${game.bet}`);
        }
    }

    // Check if we successfully joined
    if (event.data.includes("42/crash,[\"game-join-success\"")) {
        if (game.joined) {
            return console.log("[CRASH] Why did we try to join again when we are already in? (my code is shit)");
        }

        game.joined = true;
        console.log("[CRASH] Joined game successfully");
    }

    // Game starting
    if (event.data.includes("42/crash,[\"eos-commit\"")) {
        if (!game.joined) {
            console.log("[CRASH] Failed to join game");
        }

        game.started = true;
    }

    // Game end
    if (event.data.includes("42/crash,[\"game-end\",")) {
        const crashPoint = event.data.match(/(?<="crashPoint":)(.*?)(?=,)/)[0];
        game.started = false;

        if (!game.joined) {
            return console.log(`[CRASH] Ignoring as we haven't joined this round.: ${crashPoint}`);
        }

        if (crashPoint >= 2) {
            game.lossStreak = 0;
            console.log(`[CRASH] Won: ${crashPoint}x`);
            await calculateBet(true);
        } else {
            game.lossStreak = game.lossStreak + 1;
            console.log(`[CRASH] Lost: ${crashPoint}x - #${game.lossStreak}`);
            await calculateBet(false);
        }

        console.log("──────────────────────────────────");
        game.joined = false;
    }
}

export { crash, game };
