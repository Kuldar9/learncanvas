import { MainScene } from './MainScene'
import './style.css'
import Phaser from 'phaser';

var config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: new MainScene()
};
var game = new Phaser.Game(config);