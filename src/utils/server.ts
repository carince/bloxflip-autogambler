import express from "express"
import { Logger } from "./logger.js"
import { notifyRain } from "../bloxflip/rain.js"

async function startApi() {
    const app = express()
    app.use(express.json())

    app.listen(6580, () => {
        Logger.info(`API`, `Successfully started Express server, listening on port 6580.`)
    })

    app.post('/rain', (req, res) => {
        notifyRain(req, res)
    })
}

export { startApi }