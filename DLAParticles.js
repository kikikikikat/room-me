
import utils from './utils.js';
import DLAParticle from './DLAParticle.js';

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
        for (let i = 0; i < 5; i++) {
            vants.push(new DLAParticle(p5Instance, pg.width / 2, pg.height / 2, pg));
        }
    }

    const drawSomething = (name, x, y) => {
        let img = p5Instance.loadImage(`assets/${name}.png`);
        let sth = p5Instance.createSprite(x, y, 40, 40);
        sth.rotateToDirection = true;
        sth.addImage(img);
        return sth;

    }





    const draw = () => {
        p5Instance.image(pg, contextPos.x, contextPos.y);

        pg.background(255);
        //pg.clear();

        pg.fill('black');
        pg.stroke('black');
        pg.rectMode(pg.CENTER);
        pg.rect(pg.width / 2, pg.height / 2, 1, 1);

        me.position.x = p5Instance.mouseX;
        me.position.y = p5Instance.mouseY;



        pg.updatePixels();


        me.maxSpeed = 5;

        vants.forEach(v => v.draw(pg, p5Instance));



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