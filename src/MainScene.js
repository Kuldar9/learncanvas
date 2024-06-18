import { Scene } from "phaser";
import atlas from './assets/0x72_DungeonTilesetII_v1.4.png';
import atlasJSON from './assets/atlas.json';
import mapJSON from './assets/map.json';
import { Player } from "./Player";
import { Goblin } from "./Goblin";
import { KillsManager } from "./KillsManager";

export class MainScene extends Scene {

    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.atlas('atlas', atlas, atlasJSON);
        this.load.tilemapTiledJSON('map', mapJSON);
    }
    
    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('0x72_DungeonTilesetII_v1.4', 'atlas');
        const floor = map.createLayer(0, tiles, 0, 0);
        floor.setScale(4);
        floor.setCollisionByExclusion([130]);
        const walls = map.createLayer(1, tiles, 0, 0);
        walls.setScale(4);

        // Create the player
        let player = new Player(this, 100, 100);
        this.add.existing(player);

        // Create goblins and manage them
        this.goblins = [];
        for (let i = 0; i < 3; i++) {
            let goblin = new Goblin(this, 600 + i * 120, 600 + i * 120, player);
            this.add.existing(goblin);
            this.goblins.push(goblin);
        }

        // Enable physics collisions
        this.physics.add.collider(this.goblins, floor);
        this.physics.add.collider(player, floor);

        // Create other layers as needed
        const edges = map.createLayer(2, tiles, 0, 0);
        edges.setScale(4);

        // Initialize KillsManager
        this.killsManager = new KillsManager(this);

        // Pass killsManager to Player and Goblins
        player.killsManager = this.killsManager;
        this.goblins.forEach(goblin => {
            goblin.killsManager = this.killsManager;
        });

        // Store references
        this.map = map;
        this.player = player;
    }
}