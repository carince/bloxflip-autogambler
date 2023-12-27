import { Data } from "@types";
import { config as cfg } from "@utils/config.js";
import { Logger } from "@utils/logger.js";

const analyticsData: Data = {
    startupTime: new Date().getTime(),
    games: [],
    rains: []
};

async function startReports() {
    if (!cfg.debugging.quarterly_reports) return;
    try {
        const timeDifference = new Date().getTime() - analyticsData.startupTime;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        Logger.log("DEBUG", `Quarterly Reports\nUptime: ${hours} hours, and ${minutes} minutes.\nMemory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\nGames Recorded: ${analyticsData.games.length}\nRains Recorded: ${analyticsData.rains.length}`);
    } finally {
        setTimeout(startReports, 25 * 60 * 1000);
    }
}

export { analyticsData, startReports };
