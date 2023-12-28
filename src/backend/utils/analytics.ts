import { Data } from "@types";
import { config as cfg } from "@utils/config.js";
import { Logger } from "@utils/logger.js";

const analyticsData: Data = {
    startupTime: new Date().getTime(),
    games: [],
    rains: [],
    latency: []
};

async function startReports() {
    if (!cfg.debugging.quarterly_reports) return;
    Logger.info("REPORTS", `Starting quarterly reports...\nCurrent Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}`)
    setInterval(() => {sendReport()}, 5 * 60 * 1000);
}

async function sendReport() {
    const timeDifference = new Date().getTime() - analyticsData.startupTime;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    const latency = analyticsData.latency.reduce((p, c) => p + c, 0) / analyticsData.latency.length
    return Logger.log("DEBUG", `Quarterly Reports\nUptime: ${hours} hours, and ${minutes} minutes.\nMemory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\nAverage Latency: ${latency}ms\nGames Recorded: ${analyticsData.games.length}\nRains Recorded: ${analyticsData.rains.length}`);
}

export { analyticsData, startReports };
