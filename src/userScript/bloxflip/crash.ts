import { bfWs } from "../utils/ws.js";
import { calculateBet } from "./bet.js";
import { post } from "../utils/api.js";
import { config } from "userScript/utils/config.js";

interface gameInt {
    bet: number;
    joined: boolean;
    started: boolean;
    lossStreak: number;
    crashPoint: number;
    wallet: number;
}

const game: gameInt = {
    bet: 0,
    joined: false,
    started: false,
    crashPoint: 0,
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

            bfWs.send(`42/crash,["join-game",{"autoCashoutPoint":${config.bet.multiplier * 100},"betAmount":${game.bet}}]`);
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
        game.crashPoint = event.data.match(/(?<="crashPoint":)(.*?)(?=,)/)[0];
        game.started = false;

        if (!game.joined) {
            return console.log(`[CRASH] Ignoring as we haven't joined this round.: ${game.crashPoint}`);
        }

        if (game.crashPoint >= config.bet.multiplier) {
            game.lossStreak = 0;
            console.log(`[CRASH] Won: ${game.crashPoint}x`);
            sendLog();
            await calculateBet(true);
        } else {
            game.lossStreak = game.lossStreak + 1;
            console.log(`[CRASH] Lost: ${game.crashPoint}x - #${game.lossStreak}`);
            sendLog();
            await calculateBet(false);
        }

        game.joined = false;
        console.log("──────────────────────────────────");
    }
}

function sendLog() {
    post("game", {
        game: {
            crashPoint: game.crashPoint,
            joined: game.joined,
            lossStreak: game.lossStreak,
            wallet: game.wallet,
            bet: game.bet
        }
    });
}

export { crash, game };
