import utils from './utils.js';

export default p5Instance => {

    let uts = utils(p5Instance);

    let isDarkMode = false;

    let plant, plantAnimation;

    let dropAnimation, drops = [];




    const start = () => {
        plantAnimation = p5Instance.loadAnimation('assets/level-unimaginable/plant/frame_00001.png', 'assets/level-unimaginable/plant/frame_00015.png');
        plantAnimation.looping = false;

        dropAnimation = p5Instance.loadAnimation('assets/water-drop/frame_00001.png', 'assets/water-drop/frame_00017.png');

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < (y + 1); x++)
            drops.push(
                p5Instance.createSprite((100 - y * 15) + x * 30, 200 + y * 40)
            );
        }
        drops.forEach(d => d.addAnimation('default', dropAnimation));
    }


    const drawPlant = (x, y) => {
        plant = p5Instance.createSprite(x, y);
        plant.addAnimation('default', plantAnimation);
        plant.scale = p5Instance.random(0.3, 0.5);
        plant.rotation = p5Instance.random(-30, 30);
    }

    const drawPlantsRandomly = () => {

        let x = p5Instance.random(50, 100);
        let y = -100;
        drawPlant(x, y);  

    }

    const draw = () => {
        p5Instance.background(isDarkMode ? 20 : 240);
        p5Instance.stroke(isDarkMode ? 240 : 20);

        p5Instance.push();
        p5Instance.translate(p5Instance.width / 2 - 100, p5Instance.height / 2 + 100);
        p5Instance.scale(.8);

        uts.drawVerticalArea(
            p5Instance,
            p5Instance.createVector(0, 0),
            p5Instance.createVector(50, 71),
            p5Instance.createVector(100, 0),
            p5Instance.createVector(150, 71), 
            6,
            {
 
            }
        );

        uts.drawVerticalArea(
            p5Instance,
            p5Instance.createVector(50, -71),
            p5Instance.createVector(0, 0),
            p5Instance.createVector(150, -71),
            p5Instance.createVector(100, 0),
            6
        );

        uts.drawVerticalArea(
            p5Instance,
            p5Instance.createVector(150, -71),
            p5Instance.createVector(100, 0),
            p5Instance.createVector(200, 0),
            p5Instance.createVector(150, 71),
            4
        );

        uts.drawVerticalArea(
            p5Instance,
            p5Instance.createVector(0, 0),
            p5Instance.createVector(-50, 71),
            p5Instance.createVector(50, 71),
            p5Instance.createVector(0, 144),
            4
        );

        uts.drawVerticalArea(
            p5Instance,
            p5Instance.createVector(50, 71),
            p5Instance.createVector(0, 144),
            p5Instance.createVector(150, 71), 
            p5Instance.createVector(100, 144),
            6
        );

        p5Instance.scale(1);

        if (p5Instance.random() < 0.01) {
            drawPlantsRandomly();
        }
        p5Instance.drawSprite(plant);

        p5Instance.pop();

        p5Instance.push();
        p5Instance.translate(p5Instance.width / 2 - 100, -100);
        drops.forEach((d, i) => {
            p5Instance.tint(255, 100 + 40 * i);
            p5Instance.drawSprite(d);
        })

        p5Instance.pop();

    }


    const cleanup = () => {

    }


    return {
        start,
        draw,
        cleanup
    }

};