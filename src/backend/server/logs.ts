import { Logger } from "@utils/logger.js";

async function logBloxflip(msg: string) {
    Logger.logToLogs(msg);
}

async function handleLog(log: { type: string, label: string, message: string }) {
    if (log.type == "log") Logger.log(log.label, log.message);
    if (log.type == "info") Logger.info(log.label, log.message);
    if (log.type == "warn") Logger.warn(log.label, log.message);
    if (log.type == "error") Logger.error(log.label, log.message);
}

export { handleLog, logBloxflip };
