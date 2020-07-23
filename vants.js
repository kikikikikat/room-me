
import utils from './utils.js';

class Vant {
    constructor(p5Instance, x, y) {
        this.pos = p5Instance.createVector(x, y);
        this.sprite = p5Instance.createSprite(x, y, 10, 10);
        this.dir = p5Instance.random(0, 360);
    }

    turn(context) {
        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        if (context.get(x, y)[0] !== 255) {
            this.dir += 90;
            context.set(x, y, [255, 255, 255, 255]);
        } else {
            this.dir -=90;
            context.set(x, y, [0, 0, 0, 255]);
        }
    }

    draw(context) {
        this.sprite.setSpeed(1, this.dir);
        this.turn(context);
    }
}


export default p5Instance => {

    let pg, me, uts = utils(p5Instance);

    let vant;


    const start = () => {
        pg = p5Instance.createGraphics(1280, 720);
        me = drawSomething('me', p5Instance.mouseX, p5Instance.mouseY);
        vant = new Vant(p5Instance, 50, 50);
    }

    const drawSomething = (name, x, y) => {
        let img = p5Instance.loadImage(`assets/${name}.png`);
        let sth = p5Instance.createSprite(x, y, 40, 40);
        sth.rotateToDirection = true;
        // me.velocity.x = 4;
        //me.setCollider('circle', 0, 0, 200);
        sth.addImage(img);
        return sth;

    }





    const draw = () => {
        p5Instance.image(pg, 1, 1);

        pg.background(255);

        me.position.x = p5Instance.mouseX;
        me.position.y = p5Instance.mouseY;

        pg.fill(255, 0, 0);
        pg.stroke('red');
        pg.rect(200, 300, 100, 300);
        uts.handDraw(pg, p5Instance.createVector(20, 20), p5Instance.createVector(40, 40));

        pg.set(10, 10, [0, 0, 255, 255]);

        for (let i = 0; i < 100; i++) {
            pg.set(i, 10, [0, 0, 0, 255]);
        };

        pg.updatePixels();

        // if (p5Instance.frameCount > 100) {
        //     p5Instance.noLoop();
        //     pg.set(210, 310, [0, 0, 0, 255]);
        //     console.log(pg);
        // }

        me.maxSpeed = 5;

        vant.draw(pg);

        p5Instance.drawSprites();





    }


    const cleanup = () => {
        // p5.removeSprite(river);
    }


    return {
        start,
        draw,
        cleanup
    }

};