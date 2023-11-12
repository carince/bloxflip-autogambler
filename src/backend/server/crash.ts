import { data } from "@bf/data.js";
import { socket } from "./server.js";
import { Logger } from "@utils/logger.js";
import { Game } from "@types";

function sendGames(callback: (ack: any) => unknown) {
    callback(data.games);
}

async function handleGame(game: Game & { lossStreak: number }) {
    const gameInfo = {
        crash: game.crash,
        bet: game.bet,
        balance: game.balance
    };

    Logger.logGame(game);
    data.pushGame(gameInfo);
    socket.to("analytics").emit("new-game", gameInfo);
}

export { sendGames, handleGame };
