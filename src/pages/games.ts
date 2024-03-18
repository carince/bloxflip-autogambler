import { Game } from "@types";

async function updateGames(games: Array<Game>, type: "roulette" | "crash", autocashout?: number, color?: string) {
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
            if (type === "crash") {
                if (game["crash"]! >= autocashout!) {
                    wins++;
                } else {
                    loss++;
                }
            } else {
                if (game["color"] === color) {
                    wins++;
                } else {
                    loss++;
                }
            }
        });

        won!.textContent = `${wins}`;
        lost!.textContent = `${loss}`;

        const lossStreaks: Array<number> = [];
        let currentStreak = 0;
        for (let i = 0; i < games.length; i++) {
            if (type === "crash") {
                if (games[i].crash! < autocashout!) {
                    currentStreak++;
                } else {
                    if (currentStreak > 0) {
                        lossStreaks.push(currentStreak);
                    }
                    currentStreak = 0;
                }
            } else {
                if (games[i].color !== color) {
                    currentStreak++;
                } else {
                    if (currentStreak > 0) {
                        lossStreaks.push(currentStreak);
                    }
                    currentStreak = 0;
                }
            }
        }

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

            if (type === "crash") {
                tr.className = `bg-[rgba(${game.crash! >= autocashout! ? "0,255,0" : "255,0,0"},0.25)]`;
                const status = tr.insertCell();
                status.textContent = game.crash! > autocashout! ? "Won" : "Lost";
                status.className = "font-bold";
                const crashPoint = tr.insertCell();
                crashPoint.textContent = `${game.crash}x`;
            } else {
                tr.className = `bg-[rgba(${game.color === color ? "0,255,0" : "255,0,0"},0.25)]`;
                const status = tr.insertCell();
                status.textContent = game.color === color ? "Won" : "Lost";
                status.className = "font-bold";
                const gameColor = tr.insertCell();
                gameColor.textContent = game.color!;
            }

            const bet = tr.insertCell();
            bet.textContent = `${game.bet} R$`;
            const balance = tr.insertCell();
            balance.textContent = `${game.balance} R$`;

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

export { updateGames };
