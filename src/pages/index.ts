import { Game, Rain, Config} from "@types";
// @ts-ignore
import io from "../../node_modules/socket.io-client/dist/socket.io.js";

import { User as UserType, Data as DataType } from "@types";
import { updateUser } from "./profile.js";
import { updateGames } from "./games.js";
import { updateBalance } from "./balance.js";
import { updateRain } from "./rain.js";
import { updateLatency } from "./latency.js";

let games: Array<Game>;
let rains: Array<Rain>;
let config: { bet: Config["bet"], rain: { enabled: boolean, minimum: number } };
let chart: any;

async function startSocket() {
    const socket = io({
        transports: ["websocket"]
    });

    socket.on("initialization", (user: UserType, data: DataType, cfg: { bet: Config["bet"], rain: { enabled: boolean, minimum: number } }) => {
        config = cfg;
        games = data.games;
        rains = data.rains;

        updateUser(user);
        updateGames(games, config.bet.game, config.bet.crash_autocashout, config.bet.roulette_color);
        updateBalance(games);
        updateRain(rains, cfg.rain);
        updateLatency(data.latency);

        // @ts-ignore
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
    });

    socket.on("new-game", (data: Game) => {
        games.push(data);

        chart.data.labels = Array.from({ length: games.length }, (_, i) => i + 1);
        chart.data.datasets[0].data.push(data.balance);
        chart.update();

        updateGames(games, config.bet.game, config.bet.crash_autocashout, config.bet.roulette_color);
        updateBalance(games);
    });

    socket.on("new-rain", (data: Rain) => {
        rains.push(data);
        updateRain(rains, config.rain);
    });

    socket.on("update-latency", (data: Array<number>) => {
        updateLatency(data);
    });
}

startSocket();
