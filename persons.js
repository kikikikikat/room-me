
import utils from './utils.js';
import Person from './Person.js';

export default (p5Instance, opts) => {

    let pg, me, uts = utils(p5Instance);

    let vants = [];

    let contextPos, contextWidth, contextHeight;

    let personsGroup;

    var opts = opts || {};


    const start = (x, y, w, h) => {
        contextWidth = w;
        contextHeight = h;
        pg = p5Instance.createGraphics(contextWidth, contextHeight);
        contextPos = p5Instance.createVector(x, y);
        pg.contextPos = contextPos;
        me = drawSomething('me', p5Instance.mouseX, p5Instance.mouseY);
        personsGroup = new pg.Group();
        for (let i = 0; i < 20; i++) {
            vants.push(new Person(
                p5Instance, 
                p5Instance.random(0, pg.width), 
                p5Instance.random(0, pg.height), 
                pg, 
                personsGroup,
                opts
            ));
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

        vants.forEach(v => v.draw());



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