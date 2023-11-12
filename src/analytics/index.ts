import { Game, Profile, Rain } from "@types";
// @ts-ignore
import io from "../../node_modules/socket.io/client-dist/socket.io.esm.min.js";

import { updateCrash } from "./crash.js";
import { updateBalance } from "./balance.js";
import { updateRain } from "./rain.js";
import { updateProfile } from "./profile.js";

let games: Array<Game>;
let rains: Array<Rain>;
let chart: any;

async function fetchData() {
    const socket = io("http://localhost:6580", {
        transports: ["websocket"]
    });

    socket.emit("join-analytics");

    socket.emitWithAck("get-games").then((i: Array<Game>) => {
        games = i;
        
        chart = new Chart(
            document.getElementById("BalGraph"),
            {
                type: "line",
                data: {
                    labels: Array.from(Array(games.length).keys()),
                    datasets: [
                        {
                            label: "Balance",
                            data: games.map(game => game.balance)
                        }
                    ]
                }
            }
        );

        updateCrash(i);
        updateBalance(i);
    });

    socket.emitWithAck("get-rains").then((i: Array<Rain>) => {
        rains = i;
        updateRain(i);
    });

    socket.emitWithAck("get-profile").then((i: Profile) => {
        updateProfile(i);
    });

    socket.on("new-game", (i: Game) => {
        games.push(i);
        updateCrash(games);
        updateBalance(games);

        chart.data.labels = Array.from({length: games.length}, (_, i) => i + 1);
        chart.data.datasets[0].data.push(i.balance);
        chart.update();
    });

    socket.on("new-rain", (i: Rain) => {
        rains.push(i);
        updateRain(rains);
    });
}

fetchData();
