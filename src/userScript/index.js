const config = {
    auth: "",
    tries: 13
};

(async () => {
    const bfWs = new WebSocket("wss://ws.bloxflip.com/socket.io/?transport=websocket");
    let calcBet = 0;

    config.auth = localStorage.getItem(`BloxflipWSToken`)

    bfWs.addEventListener("message", async (event) => {
        if (event.data.charAt(0) == "0") {
            bfWs.send("40/crash,");
        }

        if (event.data == "40/crash") {
            bfWs.send(`42/crash,["auth","${config.auth}"]`);
            console.log("[WS] Successfully connected to WebSocket");
            await calculateBet(true);
            Promise.all([startCrash(), keepAlive(), pingCrash()]);
        }

        if (event.data.includes("42/crash,[\"game-starting\",")) {
            if (calcBet !== 0) {
                bfWs.send(`42/crash,["join-game",{"autoCashoutPoint":200,"betAmount":${calcBet}}]`);
                console.log(`[CRASH] Joining Game`)
            }
        }
    });

    async function startCrash() {
        bfWs.addEventListener("message", async (event) => {
            if (event.data.includes("42/crash,[\"game-end\",")) {
                const crashPoint = event.data.match(/(?<="crashPoint":)(.*?)(?=\,)/)[0];
                if (crashPoint >= 2) {
                    console.log(`[CRASH] Won Game: ${crashPoint}`);
                    await calculateBet(true);
                } else {
                    console.log(`[CRASH] Loss Game: ${crashPoint}`);
                    await calculateBet(false);
                }
            }
        });
    }

    async function calculateBet(won) {
        const bfApi = await fetch("https://rest-bf.blox.land/user", {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            headers: { "x-auth-token": config.auth },
        }).then(res => {
            return res.json();
        });

        const balance = Math.round((bfApi.user.wallet + Number.EPSILON) * 100) / 100;

        if (won) {
            calcBet = balance / Math.pow(2, config.tries);
            calcBet = Math.round((calcBet + Number.EPSILON) * 100) / 100;
        } else {
            calcBet = parseFloat(calcBet) * 2;
        }

        console.log(`[BET] Balance: ${balance}, Bet: ${calcBet}`);
    } await calculateBet();

    async function keepAlive() {
        await sleep(30000);
        bfWs.send("2");
        keepAlive();
    }

    async function pingCrash() {
        await sleep(25000);
        const ms = new Date().getTime();
        bfWs.send(`42/crash,["ping-req",${ms}]`);
        pingCrash();
    }
})();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
