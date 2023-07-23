import { Profile } from "@types";

async function updateProfile(profile: Profile) {
    const username = document.querySelector(".ProfileUsername");
    const headshot: HTMLImageElement | null = document.querySelector(".ProfileHeadshot");

    username!.textContent = profile.username;
    headshot!.src = `https://api.bloxflip.com/render-headshot?userId=${profile.id}&width=48&height=48&format=png`;
}

export { updateProfile };
