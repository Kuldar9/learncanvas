import * as Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, target) {
        super(scene, x, y, 'atlas', 'weapon_knife');

        // Add the bullet to the physics world
        scene.physics.add.existing(this);
        
        // Set bullet properties
        this.damage = 1;
        this.setScale(4);
        this.body.setMaxSpeed(800);
        this.body.useDamping = true;
        this.body.setSize(14, 14);
        this.body.setAngularAcceleration(5000);

        // Calculate rotation towards the target
        const angle = Phaser.Math.Angle.BetweenPoints(this, target);
        this.rotation = angle + Math.PI / 2;

        // Move bullet towards the target
        scene.physics.moveToObject(this, target, 800);

        // Handle bullet-goblin overlap
        scene.physics.add.overlap(this, scene.goblins, this.handleGoblinOverlap, null, this);

        // Handle bullet-tile collision
        scene.physics.add.collider(this, scene.map.getLayer('Floor').tilemapLayer, this.handleTileCollision, null, this);
    }

    handleGoblinOverlap(bullet, goblin) {
        goblin.takeDamage(this.damage);
        if (goblin.hp <= 0) {
            bullet.scene.player.ammo += 5;
            bullet.scene.player.ammoCounter.emit('ammoChanged', bullet.scene.player.ammo);
        }
        bullet.destroy();
    }

    handleTileCollision() {
        this.body.setVelocity(0);
        this.body.setAngularAcceleration(0);
        this.body.setAngularVelocity(0);

        // Handle bullet-player overlap for ammo pickup
        this.scene.physics.add.overlap(this, this.scene.player, this.handlePlayerOverlap, null, this);

        // Optionally, you can add a fade-out effect before destroying the bullet
        // this.scene.tweens.add({
        //     targets: this,
        //     alpha: 0,
        //     duration: 1000,
        //     ease: 'Linear',
        //     onComplete: () => {
        //         this.destroy();
        //     }
        // });
    }

    handlePlayerOverlap(bullet, player) {
        bullet.destroy();
        player.ammo++;
        player.ammoCounter.emit('ammoChanged', player.ammo);
    }

    // Uncomment and implement these methods if needed
    // preUpdate(time, delta) {
    //     this.x += this.speed.x / 1000 * delta;
    //     this.y += this.speed.y / 1000 * delta;
    // }
    // setSpeed(axis, side) {
    //     this.speed[axis] = side * this.maxSpeed;
    // }
    // setSpeedsFromAngle(angle) {
    //     this.speed.y = this.maxSpeed * Math.cos(angle);
    //     this.speed.x = this.maxSpeed * Math.sin(angle);
    // }
}