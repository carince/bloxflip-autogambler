import fetch from "node-fetch";
import { config } from "./config";

async function push(json: JSON) {
    const body = JSON.stringify(json);

    if (config.webhook.enabled) {
        await fetch(config.webhook.link, {
            method: "POST",
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
            },
            body: body
        });
    }
}

export { push };
