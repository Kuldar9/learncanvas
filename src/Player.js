import { Physics } from 'phaser';
import { Bullet } from './Bullet';
import { InputManager } from './InputManager';

export class Player extends Physics.Arcade.Sprite {
    input;
    shootInterval = 500;
    lastShotTime = 0;
    ammo = 25;
    ammoCounter;
    hp = 3;
    hpCounters = [];
    currentWeapon = 'knife'; // Default weapon
    weapons = {
        knife: { shootInterval: 200, ammoCapacity: Infinity },
        pistol: { shootInterval: 500, ammoCapacity: 10 }
        // Add more weapons as needed
    };

    takeDamage(damage) {
        if (this.canTakeDamage()) {
            this.hp -= damage;
            this.updateHealthDisplay();
    
            if (this.hp <= 0) {
                this.disableBody();
                this.rotation = Math.PI / 2;
    
                const restartDelay = 1000; // Delay in milliseconds
                this.scene.time.delayedCall(restartDelay, () => {
                    this.scene.scene.restart();
                });
            }
        }
    }
    
    canTakeDamage() {
        return this.hp > 0;
    }

    increaseAmmo(amount = 1) {
        this.ammo += amount;
        this.ammoCounter.emit('ammoChanged', this.ammo);
    }

    switchWeapon(weapon) {
        if (this.weapons.hasOwnProperty(weapon)) {
            this.currentWeapon = weapon;
            this.shootInterval = this.weapons[weapon].shootInterval;
            this.ammoCounter.setText(`Ammo: ${this.ammo}`);
        }
    }

    shoot(time) {
        if (time - this.lastShotTime > this.shootInterval && this.ammo > 0) {
            this.ammo--;
            this.ammoCounter.emit('ammoChanged', this.ammo);
            this.scene.add.existing(new Bullet(this.scene, this.x, this.y, this.input.mouse));
            this.lastShotTime = time;
        }
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'atlas', 'elf_m_idle_anim_0');
        scene.physics.add.existing(this);

        this.ammoCounter = scene.add.text(100, 100, `Ammo: ${this.ammo}`, { fontSize: '32px', fill: '#ffffff' });
        this.ammoCounter.setOrigin(0.5);
        this.ammoCounter.on('ammoChanged', (ammo) => {
            this.ammoCounter.setText(`Ammo: ${ammo}`);
        });

        this.createHealthDisplay();

        this.body.setOffset(0, 12);
        this.body.setSize(16, 16, false);
        this.body.setMaxSpeed(400);
        this.body.setDrag(800, 800);

        this.anims.create({
            key: 'elf_m_idle_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'elf_m_idle_anim_', start: 0, end: 3 }),
            repeat: -1,
            frameRate: 8,
        });

        this.anims.play('elf_m_idle_anim');

        this.setScale(4);
        this.input = new InputManager(scene);

        // Example: Switching weapons using keyboard keys (can be customized)
        scene.input.keyboard.on('keydown-N', () => this.switchWeapon('knife'));
        scene.input.keyboard.on('keydown-P', () => this.switchWeapon('pistol'));
    }

    isMoving() {
        return this.body.speed > 0;
    }

    createHealthDisplay() {
        // Create health counters (hearts)
        for (let i = 0; i < this.hp; i++) {
            const hpCounter = this.scene.add.image(20 + i * 32, 20, 'atlas', 'ui_heart_full').setOrigin(0, 0).setScale(2);
            this.hpCounters.push(hpCounter);
        }
    }

    updateHealthDisplay() {
        // Update hearts display based on current health
        this.hpCounters.forEach(counter => counter.destroy());
        this.hpCounters = [];

        for (let i = 0; i < this.hp; i++) {
            const frame = (i < this.hp) ? 'ui_heart_full' : 'ui_heart_empty'; // Check if the heart should be full or empty
            const hpCounter = this.scene.add.image(20 + i * 32, 20, 'atlas', frame).setOrigin(0, 0).setScale(2);
            this.hpCounters.push(hpCounter);
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.input.keys.KeyA.isDown) {
            this.body.setVelocityX(-this.body.maxSpeed);
            this.setFlipX(true);
        }
        else if (this.input.keys.KeyD.isDown) {
            this.body.setVelocityX(this.body.maxSpeed);
            this.setFlipX(false);
        }
        else {
            this.body.setVelocityX(0);
        }

        if (this.input.keys.KeyW.isDown) {
            this.body.setVelocityY(-this.body.maxSpeed);
        }
        else if (this.input.keys.KeyS.isDown) {
            this.body.setVelocityY(this.body.maxSpeed);
        }
        else {
            this.body.setVelocityY(0);
        }

        if (this.input.keys.Space.isDown) {
            this.shoot(time);
        }

        if (this.isMoving()) {
            this.play('elf_m_run_anim', true);
        } else {
            this.play('elf_m_idle_anim', true);
        }
    }
}