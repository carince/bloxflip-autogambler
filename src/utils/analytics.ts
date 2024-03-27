import { Game, Data, Rain } from "@types";
import { config as cfg, config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { io } from "@utils/server.js";

let analytics: AnalyticsClass;

class AnalyticsClass {
    public data: Data;

    public async appendGame(data: Game) {
        this.data.games.push(data);

        if (!config.debugging.disable_analytics) io.emit("new-game", data);  
    }

    public async appendRain(rain: Rain) {
        this.data.rains.push(rain);

        if (!config.debugging.disable_analytics) io.emit("new-rain", rain);
    }

    public async appendLatency(latency: number) {
        const latencyArr = this.data.latency;
        if (latencyArr.length >= 10) {
            latencyArr.pop();
        }
        latencyArr.unshift(latency);

        if (!config.debugging.disable_analytics) io.emit("update-latency", latencyArr);
    }
    
    private async sendReport() {
        const timeDifference = new Date().getTime() - this.data.startupTime;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    
        const latency = (this.data.latency.reduce((p, c) => p + c, 0) / this.data.latency.length).toFixed(2);
        return Logger.info("DEBUG", `AutoCrash Report\nUptime: ${hours} hours, and ${minutes} minutes.\nMemory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\nAverage Latency: ${latency}ms\nGames Recorded: ${this.data.games.length}\nRains Recorded: ${this.data.rains.length}`);
    }

    constructor() {
        Logger.info("ANALYTICS", "Starting analytics...");
        this.data = {
            startupTime: new Date().getTime(),
            games: [],
            rains: [],
            latency: []
        };

        if (!cfg.debugging.reports) return;
        Logger.info("REPORTS", "Starting reports...");
        setInterval(() => { this.sendReport(); }, 30 * 60 * 1000);
    }
}

async function startAnalytics() {
    analytics = new AnalyticsClass();
}

export { startAnalytics, analytics };
