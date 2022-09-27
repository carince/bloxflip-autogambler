import fetch from 'node-fetch'
import { config } from './config';
import { Logger } from './logger';

async function sendWh(json: {}) {
    const content = JSON.stringify(json)

    if (config.webhook.enabled) {
        await fetch(config.webhook.link, {
            method: 'post',
            headers: {'Content-Type': 'application/json'}, 
            body: content
        }).catch(() => Logger.warn(`WEBHOOK`, `Failed to send message to webhook.`))
    }
}

export { sendWh };
