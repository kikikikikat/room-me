import utils from './utils.js';

export default p5Instance => {


    let isDarkMode = false;
    let uts = utils(p5Instance);

    let mask, masked;

    let pg3D;

    let desk, chair, windows;


    const start = () => {
        mask = p5Instance.loadImage('assets/level-friend/frame_00001.png');
        masked = p5Instance.createGraphics(1280, 720);

        pg3D = p5Instance.createGraphics(252, 122, p5Instance.WEBGL);

        desk = p5Instance.createSprite(650, 360);
        desk.scale = .2;
        desk.addAnimation('default', 'assets/desk/frame_00001.png', 'assets/desk/frame_00002.png');

        chair = p5Instance.createSprite(650, 370);
        chair.scale = .2;
        chair.addAnimation('default', 'assets/chair/frame_00001.png', 'assets/chair/frame_00002.png');

        chair = p5Instance.createSprite(650, 370);
        chair.scale = .2;
        chair.addAnimation('default', 'assets/chair/frame_00001.png', 'assets/chair/frame_00002.png');

        windows = p5Instance.createSprite(650, 370);
        windows.scale = .2;
        windows.addAnimation('default', 'assets/windows/frame_00001.png', 'assets/windows/frame_00002.png');
    }

    const drawNoisy = (context) => {
        let size = 20;
        p5Instance.noFill();
        for (let i = 0; i < 1000; i++) {
            let firstPoint = [
                p5Instance.random(0, context.width),
                p5Instance.random(0, context.height)
            ];
            context.triangle(
                firstPoint[0],
                firstPoint[1],
                firstPoint[0] + p5Instance.random(-size, size),
                firstPoint[1] + p5Instance.random(-size, size),
                firstPoint[0] + p5Instance.random(-size, size),
                firstPoint[1] + p5Instance.random(-size, size),
            );
        }
    }



    const draw = () => {
        p5Instance.background(isDarkMode ? 20 : 240);
        p5Instance.stroke(isDarkMode ? 240 : 20);

        
        //masked.background(255 * (p5Instance.cos(p5Instance.frameCount * 0.1)), 0, 0);
        drawNoisy(masked);

        let maskedR = masked._renderer.get();
        maskedR.mask(mask);
        p5Instance.push();
        p5Instance.translate(p5Instance.width / 2, p5Instance.height / 2);
        p5Instance.imageMode(p5Instance.CENTER);
        p5Instance.image(maskedR, 0, 0);
        p5Instance.pop();

        masked.clear();

        p5Instance.imageMode(p5Instance.CENTER);
        p5Instance.image(pg3D, p5Instance.width / 2, p5Instance.height / 2 + 40);
        pg3D.background(255, 255, 255, 180);
        pg3D.noFill();
        // pg3D.perspective(.8);
        // pg3D.rotateX(p5Instance.frameCount * 0.001);
        // pg3D.rotateY(p5Instance.frameCount * 0.001);
        pg3D.box(250, 120, 160);

        pg3D.drawSprite(desk);
        pg3D.drawSprite(chair);
        pg3D.drawSprite(windows);

 
        
    }


    const cleanup = () => {

    }


    return {
        start,
        draw,
        cleanup
    }

};