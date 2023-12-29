import { Rain } from "@types";

async function updateRain(rains: Array<Rain>, cfg: { enabled: boolean, minimum: number }) {
    const card = document.querySelector(".RainCard");
    const amount = document.querySelector(".RainsAmount");
    const prize = document.querySelector(".RainsPrize");
    const recent = document.querySelector(".RainsRecent");

    if (!cfg.enabled) {
        card!.className = `${card!.className} pointer-events-none opacity-25`;
    }

    amount!.textContent = `${rains.length}`;

    const prizes = rains.map(rain => {
        return rain.prize;
    });

    prize!.textContent = rains.length ? `${Math.max(...prizes)} R$` : "No data to analyze with.";

    const recentRains = rains.slice(-10);

    const bodies = document.querySelectorAll("table.RainsRecent > tbody");
    Array.from(bodies).map(body => {
        body.remove();
    });

    const tbody = document.createElement("tbody");
    recentRains.map(rain => {
        const tr = document.createElement("tr");
        tr.className = `bg-[rgba(${rain["prize"] <= cfg.minimum ? "255,0,0" : "0,255,0"},0.25)]`;
        const host = tr.insertCell();
        host.textContent = rain.host;
        host.className = "font-bold";
        const prize = tr.insertCell();
        prize.textContent = `${rain.prize} R$`;

        const date = new Date(rain.time);
        const dateTime = tr.insertCell();
        dateTime.textContent = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        tr.insertCell;

        recent!.appendChild(tbody);
        tbody.appendChild(tr);
    });
}

export { updateRain };
