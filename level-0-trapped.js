import utils from './utils.js';

export default p5Instance => {


    let isDarkMode = false;
    let uts = utils(p5Instance);

    let mask, masked;

    let nx, ny, nz = 0;


    const start = () => {
        mask = p5Instance.loadImage('assets/level-trapped/frame_00002.png');
        masked = p5Instance.createGraphics(200, 200);
    }

    const drawNoisy = (context) => {
        let size = 10;
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

    const drawStream = () => {
        let offset = 50;
        let size = 50;
        let paddingFactor = .3;
        nx = 0;
        for (let i= p5Instance.width * paddingFactor; i < p5Instance.width - p5Instance.width * paddingFactor; i += 45) {
          ny = 0;
          for (let j=p5Instance.height * paddingFactor; j<p5Instance.height - p5Instance.height * paddingFactor; j += 45) {
            let angle = p5Instance.map (p5Instance.noise (nx, ny, nz), 0, 3, 0, p5Instance.PI*5);
            let x = size * p5Instance.cos (angle);
            let y = size * p5Instance.sin (angle);
            uts.handDraw(
                p5Instance,
                p5Instance.createVector(i, j),
                p5Instance.createVector(i + x, j + y)
            )

            uts.handDraw(
                p5Instance,
                p5Instance.createVector(i+offset+x, j+y),
                p5Instance.createVector(i + offset, j)
            )
            uts.handDraw(
                p5Instance,
                p5Instance.createVector(i, j),
                p5Instance.createVector(i + offset, j)
            )

            uts.handDraw(
                p5Instance,
                p5Instance.createVector(i + x, j + y),
                p5Instance.createVector(i+offset+x, j+y)
            )
            
            ny += 0.03;
          }
          nx += 0.02;
        }
        nz +=0.01;
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
        p5Instance.rotate(p5Instance.PI / 180 * 45);
        p5Instance.rotate(p5Instance.map(p5Instance.mouseX, 0, p5Instance.width, 0, p5Instance.TWO_PI));
        p5Instance.imageMode(p5Instance.CENTER);
        p5Instance.image(maskedR, 0, 0);
        p5Instance.pop();

        masked.clear();

        drawStream();


 
        
    }


    const cleanup = () => {

    }


    return {
        start,
        draw,
        cleanup
    }

};