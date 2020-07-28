
import utils from './utils.js';
import main from './main.js';


export default p5Instance => {

    let pg, linesPg, stairs, uts = utils(p5Instance);
    let offsetX, offsetY, scaleFactor;

    const start = () => {
        scaleFactor = .7;
        pg = p5Instance.createGraphics(640, 420);
        linesPg = p5Instance.createGraphics(200, 200);
        stairs = p5Instance.createSprite(540, 320); // put sprite at (0, 0)
        stairs.addAnimation('default', `assets/level-stairs/frame_00001.png`, `assets/level-stairs/frame_00002.png`);
        stairs.scale = scaleFactor;

        offsetX = 180;
        offsetY = 90;
    }

    p5Instance.mousePressed = () => {
        // drawFlowers();
    }

    const draw = () => {
        pg.background(255, 255, 255);
        let pgX = p5Instance.windowWidth / 2 - pg.width / 2;
        let pgY = p5Instance.windowHeight / 2 - pg.height / 2;
        p5Instance.image(pg, pgX, pgY);

        p5Instance.drawSprite(stairs);

        uts.drawVerticalArea(
            p5Instance,
            p5Instance.createVector(422, 335),
            p5Instance.createVector(424, 496),
            p5Instance.createVector(477, 358),
            p5Instance.createVector(478, 518),
            4
        )
    }


    const cleanup = () => {
        console.log('clean up river');
        // p5.removeSprite(river);
    }


    return {
        start,
        draw,
        // mouseMoved,
        cleanup
    }

};