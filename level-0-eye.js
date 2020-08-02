import utils from './utils.js';

export default p5Instance => {


    let isDarkMode = false;
    let uts = utils(p5Instance);

    let eyes = [];

    let pg3D;

    const start = () => {
        let eyePositions = [];
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                eyePositions.push(
                    p5Instance.createVector(
                        p5Instance.width / 2 + x * 120,
                        p5Instance.height / 2 + y * 100
                    )
                )           
            }
        }
        for (let i = 0; i < 9; i++) {
            eyes.push(createEye(eyePositions[i].x, eyePositions[i].y));
        }
        pg3D = p5Instance.createGraphics(700, 700, p5Instance.WEBGL);
    }

    const createEye = (x, y) => {
        let sprite = p5Instance.createSprite(x || p5Instance.width / 2, y || p5Instance.height / 2);
        sprite.addImage(p5Instance.loadImage('assets/level-eye/eye-socket.png'));
        sprite.scale = .2;
        return sprite;
    }

    const getEyeballPos = (x, y, radius) => {
        let ro = 7;
        let dist = p5Instance.dist(p5Instance.mouseX, p5Instance.mouseY, x, y); 
        let si1 = (p5Instance.mouseX-x)/dist; 
        let co1 = (p5Instance.mouseY-y)/dist;
        let ox, oy;
        if(p5Instance.abs(dist) < radius){ 
          ox = p5Instance.mouseX; 
          oy = p5Instance.mouseY; 
        }
        else{ 
          ox = x+ro*si1; 
          oy = y+ro*co1; 
        }
        return p5Instance.createVector(ox, oy);
    }

    const drawEyeball = (x, y) => {
        // three levels
        // for (let i = 0; i < 3; i++) {
        //     let density = p5Instance.random(10, 40) * i;
        //     let innerRad = p5Instance.random(10, 30) * (3 - i);
        //     let length = p5Instance.random(5, 20);
        //     let offset = 0;
        //     let start;
        //     uts.drawRadiantLines(p5Instance, x, y, density, innerRad, length, {
        //         offset: offset
        //     });           
        // }

        uts.drawRadiantLines(p5Instance, x, y, 30, 10, 5, {
            distortion: 0,
            offset: 10
        });

        uts.drawRadiantLines(p5Instance, x, y, 30, 2, 5, {distortion: 30}, p5Instance.TWO_PI * 0.9);
     
        // uts.drawRadiantLines(p5Instance, x, y, 10, 5, 20, { start : 60, distortion: 60 }, p5Instance.TWO_PI * 0.4);
    }

    const draw = () => {
        p5Instance.background(isDarkMode ? 20 : 240);
        p5Instance.stroke(isDarkMode ? 240 : 20);

        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                p5Instance.push();
                let eyeBallPos = getEyeballPos(p5Instance.width / 2 + x * 120, p5Instance.height / 2 + y * 100, 20);
                drawEyeball(eyeBallPos.x, eyeBallPos.y);
                p5Instance.pop();               
            }
        }

        eyes.forEach(e => {
            p5Instance.drawSprite(e);
        })

        p5Instance.imageMode(p5Instance.CENTER);
        p5Instance.image(pg3D, p5Instance.width / 2, p5Instance.height / 2);
        //pg3D.background(255, 30, 30, 30);
        pg3D.noFill();
        // pg3D.perspective(.8);
        // pg3D.rotateX(p5Instance.frameCount * 0.001);
        // pg3D.rotateY(p5Instance.frameCount * 0.001);
        pg3D.box(480, 480, 260);

 
        
    }


    const cleanup = () => {

    }


    return {
        start,
        draw,
        cleanup
    }

};