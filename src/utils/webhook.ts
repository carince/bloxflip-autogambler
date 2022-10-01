import { curly as curl } from "node-libcurl";
import { config } from "./config";

async function sendWh(json: any) {
    if (config.webhook.enabled) {
        await curl.post(config.webhook.link, {
            postFields: JSON.stringify(json),
            httpHeader: ["Content-Type: application/json", "Accept: application/json"],
            sslVerifyPeer: false
        });
    }
}

export { sendWh };
