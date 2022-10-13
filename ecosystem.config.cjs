module.exports = {
    apps: [{
        name: "bloxflip-autocrash",
        script: "npm run start",
        min_uptime: 300000,
        max_restarts: 5,
        restart_delay: 5000,
        env: {
            "BYPASS_UPDATER": "true"
        }
    }]
}
