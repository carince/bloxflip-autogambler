import { bfWs, bfWsSend, connectBfWs, serverWs } from "../utils/ws.js";
import { calculateBet, getUserInfo } from "./bet.js";
import { rain } from "./rain.js";
import { keepAlive } from "../utils/keepAlive.js";
import { config } from "../utils/config.js";
import { Logger } from "../utils/logger.js";
import { sleep } from "@utils/sleep.js";

interface gameInt {
    bet: number;
    joined: boolean;
    started: boolean;
    lossStreak: number;
    crash: number;
    balance: number;
    count: number;
}

const game: gameInt = {
    bet: 0,
    joined: false,
    started: false,
    crash: 0,
    lossStreak: 0,
    balance: 0,
    count: 0
};

async function crash(event: MessageEvent) {
    // Unable to join due to expired/invalid token
    if (event.data.includes("42/crash,[\"notify-error\",\"Your session has expired, please refresh your page!\"]")) {
        return Logger.error("CRASH", "Token is either expired or invalid, try taking your auth token again after relogging into Bloxflip", { forceClose: true });
    }

    // Game Intermission before it starts
    if (event.data.includes("42/crash,[\"game-starting\",")) {
        if (game.bet !== 0) {
            if (game.started) {
                return Logger.warn("BET", "Cannot place bet, game has already started.");
            }

            if (game.joined) {
                return Logger.warn("BET", "Cannot place bet, already joined the game.");
            }

            bfWsSend(`42/crash,["join-game",{"autoCashoutPoint":${Math.trunc(config.bet.autoCashout * 100)},"betAmount":${game.bet}}]`);
            game.balance = game.balance - game.bet;
            game.balance = +game.balance.toFixed(2);
            Logger.log("BET", `Balance: ${game.balance}, Bet: ${game.bet}`, { skipEmit: true });
        }
    }

    // Check if we successfully joined
    if (event.data.includes("42/crash,[\"game-join-success\"")) {
        if (game.joined) {
            return Logger.log("CRASH", "Why did we try to join again when we are already in? (my code is shit)");
        }

        game.joined = true;
        Logger.log("CRASH", "Joined game successfully", { skipEmit: true });
    }

    // Game starting
    if (event.data.includes("42/crash,[\"eos-commit\"")) {
        if (!game.joined) {
            Logger.warn("CRASH", "Failed to join game, bet was not placed before game started.");
        }

        game.started = true;
    }

    // Game end
    if (event.data.includes("42/crash,[\"game-end\",")) {
        game.crash = event.data.match(/(?<="crashPoint":)(.*?)(?=,)/)[0];
        game.started = false;

        if (!game.joined) {
            return Logger.warn("CRASH", `Ignoring as we haven't joined this round: ${game.crash}x`);
        }

        if (game.crash >= config.bet.autoCashout) {
            game.lossStreak = 0;
            Logger.log("CRASH", `Won: ${game.crash}x`, { skipEmit: true });

            if (game.count % 10 === 0) {
                await getUserInfo(true)
            } else {
                game.balance = game.balance + (game.bet * config.bet.autoCashout);
                game.balance = +game.balance.toFixed(2);
            }
            
            sendGame();
            await calculateBet(true);
        } else {
            game.lossStreak = game.lossStreak + 1;
            Logger.log("CRASH", `Lost: ${game.crash}x - #${game.lossStreak}`, { skipEmit: true });
            sendGame();
            await calculateBet(false);
        }

        game.joined = false;
        Logger.log("L I N E", "──────────────────────────────────", { skipEmit: true });
    }
}

function sendGame() {
    serverWs.emit("new-game", {
        crash: game.crash,
        lossStreak: game.lossStreak,
        balance: game.balance,
        bet: game.bet
    });
}

async function startAutoCrash() {
    await connectBfWs();
    const kA = new keepAlive();
    await getUserInfo();

    bfWs.addEventListener("close", async () => {
        Logger.warn("WS", "WebSocket closed unexpectedly, attempting reconnect...");

        bfWs.removeEventListener("message", crash);
        bfWs.removeEventListener("message", rain);
        kA.stop();

        await sleep(5000);
        return startAutoCrash();
    });

    Promise.all([
        bfWs.addEventListener("message", (event) => crash(event)),
        bfWs.addEventListener("message", (event) => rain(event)),
        kA.start()
    ]);
}


export { startAutoCrash, crash, game };
