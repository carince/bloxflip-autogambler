import { Request, Response } from "express";
import { Logger } from "@utils/logger.js";
import { config } from "@utils/config.js";
import { data } from "@bf/data.js";

async function logGame(req: Request, res: Response): Promise<void> {
    const { game }: any = req.body!;

    const won = game.crashPoint >= config.bet.multiplier;

    async function calculateWallet() {
        game.wallet = game.wallet - game.bet;
        if (game.crashPoint >= config.bet.multiplier) {
            game.wallet = game.wallet + game.bet * config.bet.multiplier;
        }
        return +game.wallet.toFixed(2);
    }

    if (!game.joined) {
        Logger.log("GAME",
            `Unable to join this round. \nCrash Point: ${game.crashPoint}`,
            { customColor: 93, seperator: true}
        );
    } else {
        const wallet = await calculateWallet();

        Logger.log("GAME",
            `Status: ${won ? "Won" : `Loss - #${game.lossStreak}`} \nCrash Point: ${game.crashPoint}x \nBet: ${game.bet} R$, Wallet: ${wallet} R$`,
            { customColor: won ? 92 : 91, seperator: true}
        );

        data.pushGame({
            crash: game.crashPoint as number,
            bet: game.bet as number,
            wallet: wallet
        });
    }

    res.sendStatus(200);
}

export { logGame };
