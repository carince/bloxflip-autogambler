import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import chalk from "chalk";
import { calculateBet } from "./bet.js";
import { analytics } from "@utils/analytics.js";
import { user } from "@bf/user.js";
import { socketDisconnectReasons } from "@utils/constants.js";

interface gameInt {
    bet: number;
    joined: boolean;
    started: boolean;
    lossStreak: number;
    crash: number;
}

const game: gameInt = {
    bet: 0,
    joined: false,
    started: false,
    crash: 0,
    lossStreak: 0,
};

async function connectCrashSocket(manager: any) {
    const socket = manager.socket("/crash").open();

    socket.on("connect", async () => {
        Logger.info("SOCKET/CRASH", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
        game.bet = await calculateBet();
    });

    socket.on("disconnect", (reason: keyof typeof socketDisconnectReasons) => {
        analytics.appendLatency(-1);
        Logger.error("SOCKET/CRASH", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("pong", (ms: number) => {
        analytics.appendLatency(ms);
    });

    // Unable to join due to expired/invalid token
    socket.on("notify-error", (data: string) => {
        if (data === "Your session has expired, please refresh your page!") {
            return Logger.error("CRASH", "Token is either expired or invalid, try taking your auth token again after relogging into Bloxflip", { forceClose: true });
        }
    });

    // Game Intermission before it starts
    socket.on("game-starting", () => {
        if (game.bet === 0) return;

        if (game.started) {
            return Logger.warn("BET", "Cannot place bet, game has already started.");
        }

        if (game.joined) {
            return Logger.warn("BET", "Cannot place bet, already joined the game.");
        }

        if (game.bet > user.balance) {
            Logger.error("CRASH", `WIPED. \nBet: ${game.bet} \nBalance: ${user.balance} \nLoss Streak: ${game.lossStreak}`, { forceClose: true });
        }

        socket.emit("join-game", {
            "autoCashoutPoint": Math.trunc(config.bet.auto_cashout * 100),
            "betAmount": game.bet
        });
    });

    // Check if we successfully joined
    socket.on("game-join-success", () => {
        if (game.joined) {
            return Logger.warn("CRASH", "Why did we try to join again when we are already in? (my code is shit)");
        }

        game.joined = true;
    });

    // Game starting
    socket.on("eos-commit", () => {
        if (!game.joined) {
            Logger.warn("CRASH", "Failed to join game, bet was not placed before game started.");
        }
        game.started = true;
    });

    // Game end
    socket.on("game-end", async (data: { crashPoint: number }) => {
        game.crash = data.crashPoint;
        game.started = false;

        if (!game.joined) {
            return Logger.warn("CRASH", `Ignoring as we haven't joined this round: ${game.crash}x`);
        }

        if (game.crash >= config.bet.auto_cashout) {
            game.lossStreak = 0;
            logGame();
            game.bet = await calculateBet();
        } else {
            game.lossStreak = game.lossStreak + 1;
            logGame();
            game.bet = +(game.bet * config.bet.auto_cashout).toFixed(2);
        }

        game.joined = false;
    });
}

async function logGame() {
    analytics.appendGame({ balance: user.balance, bet: game.bet, crash: game.crash });

    if (game.crash >= config.bet.auto_cashout) {
        const message = `Game #${analytics.data.games.length}\nStatus: Won \nCrash Point: ${game.crash}x \nBet: ${game.bet} R$, Balance: ${user.balance} R$`;
        const seperator = "-".repeat(getLongestLine(message) - 7);

        console.log(`${chalk.black.bgGreenBright(" GAME ")} ${chalk.greenBright(`${seperator}\n${message}`)}`);
    } else {
        const message = `Game #${analytics.data.games.length}\nStatus: Loss - #${game.lossStreak} \nCrash Point: ${game.crash}x \nBet: ${game.bet} R$, Balance: ${user.balance} R$`;
        const seperator = "-".repeat(getLongestLine(message) - 7);

        console.log(`${chalk.bgRedBright(" GAME ")} ${chalk.redBright(`${seperator}\n${message}`)}`);
    }
}

function getLongestLine(string: string): number {
    const lines = string.split(/\r?\n/);
    return Math.max(...(lines.map(line => line.length)));
}

export { connectCrashSocket };
