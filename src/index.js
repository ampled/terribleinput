import Phaser from 'phaser';
import alarmmp3 from './assets/ALARMCLOCK.mp3';
import alarmogg from './assets/ALARMCLOCK.ogg';

class MyGame extends Phaser.Scene {

    constructor() {
        super();
    }

    preload() {
        this.load.audio('alarm', [alarmogg, alarmmp3]);
    }

    create() {
        this.code = '';
        this.alarmSound = this.sound.add('alarm');

        this.timerText = this.add.text(0, 0, '');
        this.codeInputText = this.add.text(0, 40, '', { fontSize: '72px' });

        this.timer = this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.timerText.setText(['GOOD MORNING!!!!', 'Input 0123456789 to stop the alarm. Use ↩️ to restart']);
                this.unleashBalls();
                this.alarmSound.play({ loop: true, volume: 0.01 })
            }
        });


    }

    unleashBalls() {
        const awfulColors = ['#55ad8b', '#d545c7', '#cd1857', '#ff7f00', '#71EAE7', '#a66d35', '#ffffff'];

        Array(10).fill('').forEach((_, index) => {
            const ballColor = Phaser.Display.Color.HexStringToColor(Phaser.Utils.Array.GetRandom(awfulColors)).color;
            const textColor = Phaser.Utils.Array.GetRandom(awfulColors);
            // const strokeColor = Phaser.Utils.Array.GetRandom(awfulColors);

            const circle = this.add.circle(0, 0, Phaser.Math.Between(20, 40), ballColor, 1);
            const circleNumber = this.add.text(-5, -20, index, { color: textColor, fontSize: '45px' });
            const circleWithNumber = this.add.container(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 300), [circle, circleNumber])
            circleWithNumber.setData('num', index);
            circleWithNumber.setSize(60, 60);

            this.physics.world.enable(circleWithNumber);

            circleWithNumber.body.setCollideWorldBounds(true);
            circleWithNumber.body.setVelocityX(Phaser.Math.Between(-500, 500));
            circleWithNumber.body.setAngularVelocity(Phaser.Math.Between(50, 100));

            circleWithNumber.body.setBounce(Phaser.Math.Between(1, 1.0004), 1);

            circleWithNumber
                .setInteractive()
                .on('pointerup', () => {
                    this.codeInputText.setText(this.codeInputText.text += circleWithNumber.getData('num'));
                    if (this.codeInputText.text === '0123456789') {
                        this.timerText.setText('you did it!!!!! Now try inputting your phone number');
                        this.alarmSound.stop();
                    }
                });
        });

        const ballColor = Phaser.Display.Color.HexStringToColor(Phaser.Utils.Array.GetRandom(awfulColors)).color;
        const ballTextColor = Phaser.Utils.Array.GetRandom(awfulColors);
        const ballCircle = this.add.circle(0, 0, Phaser.Math.Between(20, 40), ballColor, 1);
        const ballText = this.add.text(-5, -20, '↩️', { color: ballTextColor, fontSize: '20px' });
        const deleteBall = this.add.container(30, 0, [ballCircle, ballText])
        deleteBall.setSize(40, 40);

        this.physics.world.enable(deleteBall);

        deleteBall.body
            .setCollideWorldBounds(true)
            .setBounce(1);

        deleteBall
            .setInteractive()
            .on('pointerup', () => {
                this.codeInputText.setText('');
            });

    }

    update() {
        if (!this.timer.hasDispatched) {
            this.timerText.setText('00:' + '0' + this.timer.getOverallRemainingSeconds().toFixed(2));
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1400,
    height: 900,
    scene: MyGame,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 700, x: 0
            },
            debug: false,
            fps: 144
        }
    }
});
