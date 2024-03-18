import { Logger } from "@utils/logger.js";
import { fetchConfig } from "@utils/config.js";
import { startManager } from "@bf/index.js";
import { updateUser } from "@bf/user.js";
import { startAnalytics } from "@utils/analytics.js";
import { startServer } from "@utils/server.js";

(async (): Promise<void> => {
    Logger.log("STARTUP", "Starting bloxflip-autogambler");
    Logger.log("SUPPORT", "Support the developers by giving the repo a star! https://github.com/carince/bloxflip-autogambler");

    await fetchConfig();
    await updateUser();
    
    await startServer();
    await startAnalytics();
    await startManager();
})();
