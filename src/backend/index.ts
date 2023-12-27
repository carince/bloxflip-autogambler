import { Logger } from "@utils/logger.js";
import { fetchConfig } from "@utils/config.js";
import { startManager } from "@bf/index.js";
import { checkAuth } from "@bf/user.js";
import { startReports } from "@utils/analytics.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autocrash");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/carince/bloxflip-autocrash");

    await fetchConfig();
    await checkAuth();
    await startReports();
    await startManager();
})();
