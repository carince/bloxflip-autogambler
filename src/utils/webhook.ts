import { page } from "../index";
import { config } from "./config";

async function sendWh(json: any): Promise<void> {
    if (config.webhook.enabled) {
        const link = config.webhook.link;
        page.evaluate((json: any, link: string) => {
            console.log(link)
            fetch(link, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json)
            });
        }, json, link);
    }
}

export { sendWh };
