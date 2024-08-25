import { socketDisconnectReasons } from "@utils/constants.js";
import frmt from "@utils/number.js";
// eslint-disable-next-line
import { Manager, Socket } from "socket.io-client/dist/socket.io.dev.js";

import { config } from "../utils/config.js";
import Logger from "../utils/logger.js";
import { serverWs } from "../utils/server.js";
import calculateBet from "./bet.js";

export const game = {
    count: 0,
    balance: 0,
    bet: 0,
    joined: false,
    started: false,
    crash: 0,
    lossStreak: 0,
};

let socket: Socket;

function logGame() {
    serverWs.emit("new-game", {
        crash: game.crash,
        lossStreak: game.lossStreak,
        balance: game.balance,
        bet: game.bet,
    });
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

        if (game.bet > game.balance) {
            Logger.error("CRASH", `WIPED. \nBet: ${game.bet} \nBalance: ${game.balance} \nLoss Streak: ${game.lossStreak}`, { forceClose: true });
        }

        game.joined = true;
        // socket.emit("join-game", {
        //     autoCashoutPoint: Math.trunc(config.autocashout * 100),
        //     betAmount: game.bet,
        // });
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
            Logger.warn("CRASH", "Failed to join game, bet was not placed before game started.");
        }

        game.started = true;
    });

    // Game end
    socket.on("game-end", async (data: { crashPoint: number }) => {
        game.crash = data.crashPoint;
        game.started = false;

        if (!game.joined) {
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
            game.bet = frmt(game.bet);
        }

        game.joined = false;
    });
}
