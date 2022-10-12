module.exports = {
    apps: [{
        name: "bloxflip-autocrash",
        script: "run start",
        max_restarts: 5,
        restart_delay: 5000,
        env: {
            "bypassUpdater": "true"
        }
    }]
}
