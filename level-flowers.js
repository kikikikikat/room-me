
import utils from './utils.js';
import main from './main.js';


export default p5 => {

    let pg, roomArea, grass, flowers = [], uts = utils(p5);
    let mouseOverWhichRoomArea;

    const start = () => {
        for (let i = 0; i < 3; i++) {
            flowers.push(p5.loadImage(`assets/level-flowers/flower-${i+1}.png`));
        }
        pg = p5.createGraphics(1280, 720);
        roomArea = p5.loadImage('assets/room-area.png');
        grass = p5.loadImage('assets/level-flowers/grass.png');
    }

    const rotateDrawImg = (img, img_x, img_y, img_width, img_height, img_angle) => {
        pg.push();
        pg.imageMode(p5.CENTER);
        pg.translate(img_x+img_width/2, img_y+img_width/2);
        pg.rotate(p5.PI/180*img_angle);
        pg.image(img, 0, 0, img_width, img_height);
        pg.pop();
      }

    const drawFlowers = () => {
        let n = p5.random(1, 5);
        pg.push();
        var angleOffset, grassOffset, grassOffset2 = 0;
        if (mouseOverWhichRoomArea == 'floor') {
            angleOffset = 0;
            grassOffset = 0;
        } else if (mouseOverWhichRoomArea == 'left-wall') {
            angleOffset = 90;
            grassOffset = 35;
            grassOffset2 = -35;
        } else if (mouseOverWhichRoomArea == 'right-wall') {
            angleOffset = -90;
            grassOffset = 0;
        } else if (mouseOverWhichRoomArea == 'ceiling') {
            angleOffset = 180;
            grassOffset = -45;
        } else if (mouseOverWhichRoomArea == 'back-wall') {
            return;
        }
        let angle = angleOffset;
        //let grassOffset = angleOffset > 80 ? -45 : 0;
        rotateDrawImg(grass, p5.mouseX + grassOffset2, p5.mouseY + grassOffset, 10 * n + 50, 10 * n * 180 / 260 + 30, angle);
        for (let i = 0; i < n; i++) {
            let flower = flowers[Math.floor(p5.random(0, 3))];
            //flower.resize(30, 30);
            //let angle = n > 2 ? p5.map(i, 0, n - 1, -60, 60) + angleOffset : 0;
            let xOffset = p5.noise(i) * 10 + i * 20;
            let yOffset = Math.abs((i - (n - 1) / 2)) * 10 - 10;
            if (Math.abs(angle) == 90) {
                rotateDrawImg(flower, p5.mouseX + yOffset, p5.mouseY+ xOffset, 40, 40, angle);
            } else {
                rotateDrawImg(flower, p5.mouseX + xOffset, p5.mouseY+ yOffset, 40, 40, angle);
            }
        }
    }

    p5.mousePressed = () => {
        drawFlowers();
    }

    const mouseMoved = () => {
        let color = uts.getColor(roomArea);
        if (!color) return;
        if (color === 'red') {
            mouseOverWhichRoomArea = 'floor';
        } else if (color === 'green') {
            mouseOverWhichRoomArea = 'left-wall';
        } else if (color == 'yellow') {
            mouseOverWhichRoomArea = 'right-wall';
        } else if (color == 'pink') {
            mouseOverWhichRoomArea = 'back-wall';
        } else if (color == 'blue') {
            mouseOverWhichRoomArea = 'ceiling';
        }
        // console.log('flower ', mouseOverWhichRoomArea);

    }

    const draw = () => {
        pg.background(255, 255, 255, 0);
        p5.image(pg, 0, 0);
        // console.log('flower ', main);

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