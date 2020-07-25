
import utils from './utils.js';
import Vant from './Vant.js';

class DLAParticle {
    constructor(p5Instance, x, y) {
        this.sprite = p5Instance.createSprite(x, y, 10, 10);
        this.dir = p5Instance.random(0, 360);
    }

    setPixels(context, x, y, color) {
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 1; j++) {
                context.set(x + i, y + j, color);
            }
        }
    }

    checkAnyNeighborIsColor(context, x, y, color) {
        let result = false;
        let neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y + 1],
            [x, y - 1],
            [x + 1, y + 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [y + 1, y - 1]
        ];

        neighbors.forEach(n => {
            let c = context.get(n[0], n[1]);
            if ((c[0] == color[0]) && (c[1] == color[1]) && (c[2] == color[2])) {
                result = true;
            }
        })
        return result;
    }

    draw(context, p5Instance) {
        this.dir += p5Instance.random(0, 360);
        this.dir -= p5Instance.random(0, 360);
        this.sprite.setSpeed(1, this.dir);
        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        if (this.checkAnyNeighborIsColor(context, x, y, [0, 0, 0])) {
            this.setPixels(context, x, y, [0, 0, 0, 255]);
            this.sprite.remove();
        }
    }
}


export default p5Instance => {

    let pg, me, uts = utils(p5Instance);

    let vants = [];

    let contextPos, contextWidth, contextHeight;


    const start = (x, y, w, h) => {
        contextWidth = w;
        contextHeight = h;
        pg = p5Instance.createGraphics(contextWidth, contextHeight);
        contextPos = p5Instance.createVector(x, y);
        pg.contextPos = contextPos;
        me = drawSomething('me', p5Instance.mouseX, p5Instance.mouseY);
        for (let i = 0; i < 40; i++) {
            vants.push(new Vant(p5Instance, pg.width / 2, pg.height / 2, pg));
        }
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
        p5Instance.image(pg, contextPos.x, contextPos.y);

        pg.background(255);
        //pg.clear();

        me.position.x = p5Instance.mouseX;
        me.position.y = p5Instance.mouseY;

        // pg.fill('black');
        // pg.stroke('black');
        // //pg.rect(200, 300, 100, 300);



        pg.updatePixels();

        // if (p5Instance.frameCount > 40) {
        //     p5Instance.noLoop();
        // }

        me.maxSpeed = 5;

        vants.forEach(v => v.draw(pg, p5Instance));

        //p5Instance.drawSprites();





    }


    const cleanup = () => {
        // p5.removeSprite(river);
    }


    return {
        start,
        draw,
        contextPos: () => contextPos,
        cleanup
    }

};