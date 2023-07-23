import { Game } from "@types";

function updateBalance(games: Array<Game>) {
    const before = document.querySelector(".BalBefore");
    const current = document.querySelector(".BalCurrent");
    const highest = document.querySelector(".BalHighest");
    const lowest = document.querySelector(".BalLowest");
    const balance = document.querySelector(".ProfileBalance");

    const balances = games.map(game => game.balance);

    before!.textContent = `${balances[0]} R$`;
    current!.textContent = `${balances.slice(-1)[0]} R$`;
    highest!.textContent = `${Math.max(...balances)} R$`;
    lowest!.textContent = `${Math.min(...balances)} R$`;
    balance!.textContent = `${balances.slice(-1)[0]} R$`;
}

export { updateBalance };
