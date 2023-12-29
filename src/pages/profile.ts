import { User } from "@types";

async function updateUser(user: User) {
    const username = document.querySelector(".ProfileUsername");
    const headshot: HTMLImageElement | null = document.querySelector(".ProfileHeadshot");

    username!.textContent = user.username ? user.username : "...";
    headshot!.src = `https://api.bloxflip.com/render-headshot?userId=${user.id}&width=48&height=48&format=png`;
}

export { updateUser };