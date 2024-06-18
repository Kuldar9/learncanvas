export class KillsManager {
    kills = 0;
    killsCounter;

    constructor(scene) {
        // Adjusted position of kills counter
        this.killsCounter = scene.add.text(20, 120, `Kills: ${this.kills}`, { fontSize: '24px', fill: '#ffffff' }).setOrigin(0, 0);
    }

    increaseKillCount() {
        this.kills++;
        this.killsCounter.setText(`Kills: ${this.kills}`);
    }
}