import { Game } from "@types";

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
        streak!.textContent = games.length ? `${max == -Infinity ? "0" : max} (${maxMultiplier}x)` : "No data to analyze with.";

        const recentGames = games.slice(-10);

        const bodies = document.querySelectorAll("table.GamesRecent > tbody");
        Array.from(bodies).map(body => {
            body.remove();
        });

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
            const balance = tr.insertCell();
            balance.textContent = `${game["balance"]} R$`;

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

export { updateCrash };
