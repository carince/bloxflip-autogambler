import fetch from 'node-fetch'
import { config } from './config';

async function sendWh(json: any) {
    const content = JSON.stringify(json)

    if (config.webhook.enabled) {
        await fetch(config.webhook.link, {
            method: 'post',
            body: content
        }).then(res => console.log(res))
    }
}

export { sendWh };
