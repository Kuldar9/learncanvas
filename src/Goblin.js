import { Physics } from 'phaser';

export class Goblin extends Physics.Arcade.Sprite {
    constructor(scene, x, y, player, killsManager) {
        super(scene, x, y, 'atlas', 'goblin_idle_anim_0');

        // Initialize properties
        this.baseMaxHp = 1; // Base max health
        this.hp = this.baseMaxHp;
        this.player = player;
        this.killsManager = killsManager;

        // Add goblin to the physics world
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(10, 10, true);
        this.body.setMaxSpeed(200);
        this.body.setDrag(800, 800);

        // Create animations
        this.createAnimations();
        this.anims.play('goblin_idle_anim');
        this.setScale(4);
    }

    createAnimations() {
        this.anims.create({
            key: 'goblin_idle_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'goblin_idle_anim_', start: 0, end: 3 }),
            repeat: -1,
            frameRate: 8,
        });

        // Create other animations as needed
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.killsManager.increaseKillCount();
            this.disableBody();
            this.rotation = Math.PI / 2;

            // Fade out and destroy the goblin
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 1000,
                ease: 'Linear',
                onComplete: () => {
                    this.destroy();
                }
            });
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    
        if (this.player && this.hp > 0) {
            this.rotation = Phaser.Math.Angle.BetweenPoints(this, this.player) + Math.PI / 2;
            this.scene.physics.moveToObject(this, this.player, 200);
        }
    
        // Check collision with player to inflict damage
        if (this.scene.physics.overlap(this, this.player)) {
            // Inflict damage to the player only if the player can still take damage
            if (this.player.canTakeDamage()) {
                this.player.takeDamage(1); // Inflict 1 damage to the player
            }
        }
    
        if (this.body.speed > 0) {
            this.anims.play('goblin_run_anim', true);
        } else {
            this.anims.play('goblin_idle_anim', true);
        }
    }
}