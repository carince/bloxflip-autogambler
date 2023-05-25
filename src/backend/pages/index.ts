import { Game, Rain } from "@types";

async function fetchData() {
    const data: { games: Array<Game>, rains: Array<Rain> } = await fetch("http://localhost:6580/data").then(res => res.json());

    updateCrash(data.games);
    updateBalance(data.games);
    updateRain(data.rains);
}

async function updateCrash(games: Array<Game>) {
    const joined = document.querySelector(".GamesJoined");
    const won = document.querySelector(".GamesWon");
    const lost = document.querySelector(".GamesLost");
    const streak = document.querySelector(".GamesHighestLoss");
    const recent = document.querySelector(".GamesRecent");

    try {
        joined!.textContent = `${games.length}`;

        let wins = 0;
        let loss = 0;
        games.map(game => {
            if (game["crash"] >= 2) {
                wins++;
            } else {
                loss++;
            }
        });

        won!.textContent = `${wins}`;
        lost!.textContent = `${loss}`;

        const lossStreaks: Array<number> = [];
        let currentStreak = 0;
        games.map(game => {
            if (game["crash"] < 2) {
                currentStreak++;
            } else {
                if (currentStreak) {
                    lossStreaks.push(currentStreak);
                }
                currentStreak = 0;
            }
        });

        const max = Math.max(...lossStreaks);
        const maxMultiplier = lossStreaks.filter(num => num == max).length;
        streak!.textContent = `${max} (${maxMultiplier}x)`;

        const recentGames = games.slice(-10);
        const tbody = document.createElement("tbody");
        recentGames.map(game => {
            const tr = document.createElement("tr");
            tr.className = `bg-[rgba(${game["crash"] < 2 ? "255,0,0" : "0,255,0"},0.1)]`;
            const status = tr.insertCell();
            status.textContent = game["crash"] < 2 ? "Lost" : "Won";
            status.className = "font-bold";
            const crashPoint = tr.insertCell();
            crashPoint.textContent = `${game["crash"]}x`;
            const bet = tr.insertCell();
            bet.textContent = `${game["bet"]} R$`;
            const wallet = tr.insertCell();
            wallet.textContent = `${game["wallet"]} R$`;

            tr.insertCell;

            recent!.appendChild(tbody);
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        joined!.textContent = "ERR";
        won!.textContent = "ERR";
        lost!.textContent = "ERR";
        streak!.textContent = "ERR";
        recent!.textContent = "ERR";
    }
}

function updateBalance(games: Array<Game>) {
    const before = document.querySelector("p.BalBefore");
    const current = document.querySelector("p.BalCurrent");

    before!.textContent = `${games[0].wallet}`;
    current!.textContent = `${games.slice(-1)[0].wallet}`;
}

async function updateRain(rains: Array<Rain>) {
    const amount = document.querySelector("p.RainsAmount");
    const prize = document.querySelector("p.RainsPrize");

    amount!.textContent = `${rains.length}`;

    const prizes = rains.map(rain => {
        return rain.prize;
    });

    prize!.textContent = `${Math.max(...prizes)}`;
}

fetchData();
