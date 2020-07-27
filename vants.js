
import utils from './utils.js';
import Vant from './Vant.js';

export default (p5Instance, opts) => {

    let pg, me, uts = utils(p5Instance);

    let vants = [];

    let contextPos, contextWidth, contextHeight;

    var opts = opts || {};


    const start = (x, y, w, h) => {
        contextWidth = w;
        contextHeight = h;
        pg = p5Instance.createGraphics(contextWidth, contextHeight);
        contextPos = p5Instance.createVector(x, y);
        pg.contextPos = contextPos;
        me = drawSomething('me', p5Instance.mouseX, p5Instance.mouseY);
        for (let i = 0; i < 3; i++) {
            vants.push(new Vant(p5Instance, pg.width / 2, pg.height / 2, pg, opts));
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