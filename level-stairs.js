
import utils from './utils.js';
import main from './main.js';


export default p5Instance => {

    let pg, linesPg, stairs, uts = utils(p5Instance);
    let offsetX, offsetY, scaleFactor;

    let walker;

    const start = () => {
        scaleFactor = .7;
        pg = p5Instance.createGraphics(640, 420);
        linesPg = p5Instance.createGraphics(200, 200);
        stairs = p5Instance.createSprite(p5Instance.windowWidth / 2, 320); // put sprite at (0, 0)
        stairs.addAnimation('default', `assets/level-stairs/frame_00001.png`, `assets/level-stairs/frame_00002.png`);
        stairs.scale = scaleFactor;

        walker = p5Instance.createSprite(p5Instance.windowWidth / 2 - 10, 340);
        walker.addImage('static', p5Instance.loadImage('assets/level-stairs/spider-static/frame_00001.png'));
        walker.addAnimation('walking', 'assets/level-stairs/spider-walking/frame_00001.png', 'assets/level-stairs/spider-walking/frame_00004.png');
        walker.addImage('invisible',  p5Instance.loadImage('assets/level-stairs/spider-invisible/frame_00005.png'));
        walker.scale = 0.33;

        offsetX = 180;
        offsetY = 90;
    }

    p5Instance.mousePressed = () => {
        // drawFlowers();
    }

    let wayPoints = [
        {
            pos: p5Instance.createVector(p5Instance.windowWidth / 2 + 20, 200),
        },
        {
            pos: p5Instance.createVector(p5Instance.windowWidth / 2 - 10, 180),
            shouldHide: true
        },
        {
            pos: p5Instance.createVector(p5Instance.windowWidth / 2 - 40, 440)
        }
    ];

        const isCloseEnough = (threshold, a, b) => {
        let aPos = a instanceof p5.Vector ? a : p5Instance.createVector(a.position.x, a.position.y);
        let bPos = b instanceof p5.Vector ? b : p5Instance.createVector(b.position.x, b.position.y);
        let dist = p5.Vector.dist(aPos, bPos);
        return dist <= threshold;
    }

    let isMovingToWP = false;
    let currentDestWP = null;
    let shouldHide = false;
    const followWayPoints = (person) => {
        if (p5Instance.mouseIsPressed) {
            console.log('pressed');
            if (wayPoints.length > 0 && !isMovingToWP) {
                currentDestWP = wayPoints.shift();
                console.log('new wp', currentDestWP);
                person.attractionPoint(.8, currentDestWP.pos.x, currentDestWP.pos.y);
                isMovingToWP = true;
                walker.changeAnimation('walking');
            }
        }
    }

    const stopWayPoints = (person) => {

        if (isMovingToWP && currentDestWP && isCloseEnough(10, person, currentDestWP.pos)) {
            console.log('close to wp?');
            person.velocity.x = 0;
            person.velocity.y = 0;
            isMovingToWP = false;

            if (currentDestWP.shouldHide) {
                walker.rotationSpeed = 0.02;
                walker.rotation = -90;
                setTimeout(() => {
                    shouldHide = true;
                }, 200);
            } else {
                shouldHide = false;
            }
            currentDestWP = null;
            walker.changeImage('static');
        }
    }

    const draw = () => {
        pg.background(255, 255, 255);
        let pgX = p5Instance.windowWidth / 2 - pg.width / 2;
        let pgY = p5Instance.windowHeight / 2 - pg.height / 2;
        p5Instance.image(pg, pgX, pgY);

        p5Instance.drawSprite(stairs);

        // uts.drawVerticalArea(
        //     p5Instance,
        //     p5Instance.createVector(p5Instance.windowWidth / 2 - 100, 335),
        //     p5Instance.createVector(p5Instance.windowWidth / 2, 496),
        //     p5Instance.createVector(477, 358),
        //     p5Instance.createVector(478, 518),
        //     4
        // )

        followWayPoints(walker);
        stopWayPoints(walker);

        if (shouldHide) {
            walker.changeImage('invisible');
        }

        p5Instance.drawSprite(walker);
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