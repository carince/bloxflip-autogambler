/* eslint-disable no-console */
import calculateBet from "@bf/bet.js";
import { user } from "@bf/user.js";
import { rl } from "@utils/cli.js";
import { cliConfig, config } from "@utils/config.js";
import { socketDisconnectReasons } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import { Game } from "@utils/types.js";
import chalk from "chalk";
import readline from "readline";
import { Manager, Socket } from "socket.io-client";

const game: Game = {
    count: 0,
    bet: 0,
    joined: false,
    started: false,
    crash: 0,
    lossStreak: 0,
};

export let socket: Socket;

function getLongestLine(string: string): number {
    const lines = string.split("\n");
    return Math.max(...(lines.map((line) => line.trim().length)));
}

async function logGame() {
    game.count += 1;
    const win = game.crash >= config.autocashout;
    const message = `Game #${game.count}\nStatus: ${win ? "Won" : `Loss - #${game.lossStreak}`} \nCrash Point: ${game.crash}x \nBet: ${game.bet} R$, Balance: ${user.balance} R$`;
    const seperator = "—".repeat(getLongestLine(message));

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    if (win) {
        console.log(chalk.greenBright(`${seperator}\n${message}`));
    } else {
        console.log(chalk.redBright(`${seperator}\n${message}`));
    }
    if (rl) rl.prompt(true);
}

export default async function connectCrash(manager: Manager) {
    socket = manager.socket("/crash").open();

    socket.on("connect", async () => {
        Logger.info("SOCKET/CRASH", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
        game.bet = await calculateBet();
    });

    socket.on("disconnect", async (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/CRASH", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    // Unable to join due to expired/invalid token
    socket.on("notify-error", async (data: string) => {
        if (data === "Your session has expired, please refresh your page!") {
            Logger.error("CRASH", "Token is either expired or invalid, try taking your auth token again after relogging into Bloxflip", { forceClose: true });
        }
    });

    // Game Intermission before it starts
    socket.on("game-starting", async (): Promise<void> => {
        if (game.bet === 0) return;

        if (game.started) {
            Logger.warn("BET", "Cannot place bet, game has already started.");
            return;
        }

        if (game.joined) {
            Logger.warn("BET", "Cannot place bet, already joined the game.");
            return;
        }

        if (game.bet > user.balance) {
            Logger.error("CRASH", `WIPED. \nBet: ${game.bet} \nBalance: ${user.balance} \nLoss Streak: ${game.lossStreak}`, { forceClose: true });
        }

        if (cliConfig.paused) return;

        socket.emit("join-game", {
            autoCashoutPoint: Math.trunc(config.autocashout * 100),
            betAmount: game.bet,
        });
    });

    // Check if we successfully joined
    socket.on("game-join-success", async () => {
        if (game.joined) {
            Logger.warn("CRASH", "Why did we try to join again when we are already in? (my code is shit)");
        }
        game.joined = true;
    });

    // Game starting
    socket.on("game-start", async () => {
        if (!game.joined) {
            if (!cliConfig.paused) Logger.warn("CRASH", "Failed to join game, bet was not placed before game started.");
        }

        game.started = true;
    });

    // Game end
    socket.on("game-end", async (data: { crashPoint: number }) => {
        game.crash = data.crashPoint;
        game.started = false;

        if (!game.joined) {
            if (cliConfig.paused) {
                Logger.warn("CRASH", `Ignoring because autogambler is paused: ${game.crash}x`);
                return;
            }

            Logger.warn("CRASH", `Ignoring as we haven't joined this round: ${game.crash}x`);
            return;
        }

        if (game.crash >= config.autocashout) {
            game.lossStreak = 0;
            logGame();
            game.bet = await calculateBet();
        } else {
            game.lossStreak += 1;
            logGame();
            game.bet = +(game.bet * 2).toFixed(2);
        }

        game.joined = false;
    });
}
