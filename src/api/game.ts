import { Request, Response } from "express";
import { Logger } from "@utils/logger.js";

async function logGame(req: Request, res: Response): Promise<void> {
    const { game }: any = req.body!;

    if (!game.joined) {
        Logger.log("GAME",
            `Ignoring as we haven't joined this round. \nCrash Point: ${game.crashPoint}`,
            { customColor: 93, seperator: true}
        );
    } else {
        Logger.log("GAME",
            `Status: ${game.crashPoint >= 2 ? "Won" : `Loss - #${game.lossStreak}`} \nCrash Point: ${game.crashPoint}x \nBet: ${game.bet} R$, Wallet: ${game.wallet} R$`,
            { customColor: game.crashPoint >= 2 ? 92 : 91, seperator: true}
        );
    }

    res.sendStatus(200);
}

export { logGame };
