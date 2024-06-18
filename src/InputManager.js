export class InputManager {
    keys = {};
    constructor(scene){
        this.keys['KeyA'] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys['KeyW'] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys['KeyD'] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys['KeyS'] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys['Space'] = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        scene.input.on('pointermove', function (pointer)
        {
            this.mouse = pointer;
        }, this);
    }
   
}