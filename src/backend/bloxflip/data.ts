import { Game, Rain, Profile } from "@types";
import { config } from "@utils/config.js";

class Data {
    games: Array<Game>;
    rains: Array<Rain>;
    profile: Profile & { options: { autoCashout: number } };

    public pushGame(game: Game) {
        this.games.push(game);
    }

    public pushRain(rain: Rain) {
        this.rains.push(rain);
    }

    public updateProfile(profile: Profile) {
        this.profile = {
            id: profile.id,
            username: profile.username,
            options: {
                autoCashout: config.bet.auto_cashout
            }
        };
    }

    constructor() {
        this.games = [];
        this.rains = [];
        this.profile = { username: "null", id: 0, options: { autoCashout: 2 } };
    }
}

const data = new Data();

export { data };
