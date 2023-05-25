import { Request, Response } from "express";
import { data } from "@bf/data.js";

function sendData(req: Request, res: Response) {
    res.send({
        games: data.games,
        rains: data.rains
    });
}

export { sendData };
