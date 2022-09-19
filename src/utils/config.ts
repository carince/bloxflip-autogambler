import { Logger } from './logger'
import { readFileSync } from 'fs'
import { join } from 'path'

interface configInt {
    auth: string;
    tries: number;
    webhook: {
        enabled: boolean;
        link: string;
    };
    debugging: {
        headless: boolean;
    }
}

let config: configInt

try {
    config = JSON.parse(readFileSync(join(__dirname, `..`, `config.json`), `utf-8`))
} catch (err) {
    Logger.error(`CONFIG`, `Unable to read config.json\n${err}`)
}

export { config }