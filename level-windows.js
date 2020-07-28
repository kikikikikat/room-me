
import utils from './utils.js';
import main from './main.js';


export default p5Instance => {

    let pg, windows, area, uts = utils(p5Instance);
    let offsetX, offsetY, scaleFactor;

    const start = () => {
        scaleFactor = 0.5;
        pg = p5Instance.createGraphics(640, 420);
        windows = p5Instance.createSprite(320, 220); // put sprite at (0, 0)
        windows.addAnimation('default', `assets/level-windows/frame_00001.png`, `assets/level-windows/frame_00002.png`);
        windows.scale = scaleFactor;

        area = p5Instance.loadImage('assets/level-windows/area.png');
        area.resize(640, 360);
        offsetX = 180;
        offsetY = 90;
    }

    p5Instance.mousePressed = () => {
        // drawFlowers();
    }

    let isCoolingOff = false;

    const mouseMoved = () => {
        let color = uts.getColor(area, p5Instance.mouseX - offsetX, p5Instance.mouseY - offsetY);
        if (!color) return;
        if (color === 'red' && !isCoolingOff) {
            console.log('window!');
            pg.circle(p5Instance.mouseX, p5Instance.mouseY, 10);
            p5Instance.createSprite(p5Instance.mouseX, p5Instance.mouseY, 10, 10);
            isCoolingOff = true;
            setTimeout(() => {
                isCoolingOff = false;
            }, 1000);
        } 

    }

    const draw = () => {
        pg.background(255, 255, 255);
        let pgX = p5Instance.windowWidth / 2 - pg.width / 2;
        let pgY = p5Instance.windowHeight / 2 - pg.height / 2;
        p5Instance.image(pg, pgX, pgY);
        p5Instance.push();
        p5Instance.translate(offsetX, offsetY);
        p5Instance.drawSprite(windows);

        area.resize(640, 360);
        p5Instance.pop();

    }


    const cleanup = () => {
        console.log('clean up river');
        // p5.removeSprite(river);
    }


    return {
        start,
        draw,
        mouseMoved,
        cleanup
    }

};