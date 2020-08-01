
import utils from './utils.js';
import main from './main.js';


export default p5Instance => {

    let pg, windows, area, hand, handAnimation, smokeAnimation, smoke, birdAnimation, bird, uts = utils(p5Instance);
    let offsetX, offsetY, scaleFactor;

    const start = () => {
        scaleFactor = 0.5;
        pg = p5Instance.createGraphics(640, 420);
        windows = p5Instance.createSprite(320, 180); // put sprite at (0, 0)
        windows.addAnimation('default', `assets/level-windows/frame_00001.png`, `assets/level-windows/frame_00002.png`);
        windows.scale = scaleFactor;
    
        smokeAnimation = p5Instance.loadAnimation('assets/level-windows/smoke/frame_00001.png', 'assets/level-windows/smoke/frame_00010.png');
        smokeAnimation.looping = false;


        birdAnimation = p5Instance.loadAnimation('assets/level-windows/bird/frame_00001.png', 'assets/level-windows/bird/frame_00011.png');
        birdAnimation.looping = false;

        handAnimation = p5Instance.loadAnimation('assets/level-windows/hand/frame_00001.png', 'assets/level-windows/hand/frame_00013.png');
        handAnimation.looping = false;

        area = p5Instance.loadImage('assets/level-windows/area.png');
        area.resize(640, 360);
        offsetX = 180;
        offsetY = 90;
    }

    p5Instance.mousePressed = () => {
        // drawFlowers();
    }

    const drawSmoke = (x, y) => {
        smoke = p5Instance.createSprite(x, y);
        smoke.addAnimation('default', smokeAnimation);
        smoke.scale = 0.5;
    }

    const drawBird = (x, y) => {
        bird = p5Instance.createSprite(x, y);
        bird.addAnimation('default', birdAnimation);
        bird.scale = 0.3;
    }

    const drawHand = (x, y) => {
        hand = p5Instance.createSprite(x, y);
        hand.addAnimation('default', handAnimation);
        hand.scale = 0.4;
    }

    const mouseClicked = () => {
        let color = uts.getColor(area, p5Instance.mouseX - offsetX, p5Instance.mouseY - offsetY);
        console.log(color);
        //if (!color) return;
        // then clicking on the window
        if (color == 'red') {
            if (p5Instance.mouseX > 500) {
                drawHand(p5Instance.mouseX - 190, p5Instance.mouseY - 100);
            } else {
                if (p5Instance.random() < 0.5) {
                    drawSmoke(p5Instance.mouseX - 150, p5Instance.mouseY - 100);
                } else {
                    drawBird(p5Instance.mouseX - 50, p5Instance.mouseY - 100);
                }
            }
        }
    }

    const draw = () => {
        p5Instance.background(250);
        p5Instance.push();
        p5Instance.translate(offsetX, offsetY);
        p5Instance.drawSprite(windows);
        p5Instance.drawSprite(smoke);
        p5Instance.drawSprite(bird);
        p5Instance.drawSprite(hand);

        // p5Instance.image(area, 0, 0);

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
        mouseClicked,
        cleanup
    }

};