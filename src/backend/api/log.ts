import { Request, Response } from "express";
import { Logger } from "@utils/logger.js";

async function log(req: Request, res: Response): Promise<void> {
    const { logs }: any = req.body!;
    const { type }: any = req.params!

    if ( type == 'log') Logger.log(logs.label!, logs.message!, logs.options)
    if ( type == 'info') Logger.info(logs.label!, logs.message!)
    if ( type == 'warn') Logger.warn(logs.label!, logs.message!)
    if ( type == 'error') Logger.error(logs.label!, logs.message!, logs.options.forceClose!)

    res.sendStatus(200);
}

export { log };
