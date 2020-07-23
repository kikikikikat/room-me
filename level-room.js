
import utils from './utils.js';


export default p5Instance => {

    let pg, me, it, uts = utils(p5Instance);
    let roomLeftTop, roomLeftBottom, roomRightTop, roomRightBottom;
    let screenLeftTop, screenLeftBottom, screenRightTop, screenRightBottom;
    let pointsToDraw = [];
    let wayPoints = [];

    const start = () => {
        pg = p5Instance.createGraphics(320, 180);
        me = drawSomething('me', p5Instance.mouseX, p5Instance.mouseY);
        it = drawSomething('it', 300, 300);
        let x1 = pg.width * p5Instance.random(0.2, 0.3);
        let y1 = pg.height * p5Instance.random(0.1, 0.3);
        let x2 = pg.width * p5Instance.random(0.6, 0.8);
        let y2 = pg.height * p5Instance.random(0.7, 0.8);
        roomLeftTop = p5Instance.createVector(x1, y1);
        roomLeftBottom = p5Instance.createVector(x1, y2);
        roomRightTop = p5Instance.createVector(x2, y1);
        roomRightBottom = p5Instance.createVector(x2, y2);
    
        screenLeftTop = p5Instance.createVector(0, 0);
        screenLeftBottom = p5Instance.createVector(0, pg.height);
        screenRightTop = p5Instance.createVector(pg.width, 0);
        screenRightBottom = p5Instance.createVector(pg.width, pg.height);

        console.log(screenLeftBottom);

        wayPoints = [
            p5Instance.createVector(pg.width / 2 - 100, roomLeftBottom.y + 50),
            p5Instance.createVector(pg.width / 2 - 200, roomLeftBottom.y + 250),
            p5Instance.createVector(pg.width / 2 + 200, roomLeftBottom.y + 250),
            p5Instance.createVector(pg.width / 2 + 100, roomLeftBottom.y + 50)
        ];
    }

    const drawSomething = (name, x, y) => {
        let img = p5Instance.loadImage(`assets/${name}.png`);
        let sth = p5Instance.createSprite(x, y, 40, 40);
        sth.rotateToDirection = true;
        // me.velocity.x = 4;
        //me.setCollider('circle', 0, 0, 200);
        sth.addImage(img);
        return sth;

    }


    const drawRoom = (context, leftTop, rightBottom) => {
        let scrnLeftTop = p5Instance.createVector(0, 0);
        let scrnLeftBottom = p5Instance.createVector(0, p5Instance.height - 2);
        let scrnRightTop = p5Instance.createVector(p5Instance.width - 2, 0);
        let scrnRightBottom = p5Instance.createVector(p5Instance.width - 2, p5Instance.height - 2);

        let leftBottom = p5Instance.createVector(leftTop.x, rightBottom.y);
        let rightTop = p5Instance.createVector(rightBottom.x, leftTop.y);

        uts.handDraw(context, leftTop, rightTop);
        uts.handDraw(context, rightTop, rightBottom);
        uts.handDraw(context, leftTop, leftBottom);
        uts.handDraw(context, leftBottom, rightBottom);

        console.log(screenLeftBottom);

        uts.handDraw(context, screenLeftTop, leftTop);
        uts.handDraw(context, screenRightTop, rightTop);
        uts.handDraw(context, screenLeftBottom, leftBottom);
        uts.handDraw(context, screenRightBottom, rightBottom);
    }


    const isCloseEnough = (threshold, a, b) => {
        let aPos = a instanceof p5.Vector ? a : p5Instance.createVector(a.position.x, a.position.y);
        let bPos = b instanceof p5.Vector ? b : p5Instance.createVector(b.position.x, b.position.y);
        let dist = p5.Vector.dist(aPos, bPos);
        return dist <= threshold;
    }

    let isMovingToWP = false;
    let currentDestWP = null;
    const followWayPoints = (avoider, chaser) => {
        if (isCloseEnough(120, avoider, chaser)) {
            if (wayPoints.length > 0 && !isMovingToWP) {
                currentDestWP = wayPoints.shift();
                // pointsToDraw.push(currentDestWP);
                avoider.attractionPoint(5, currentDestWP.x, currentDestWP.y);
                isMovingToWP = true;
            }
        }
    }

    const stopWayPoints = (person) => {

        if (isMovingToWP && currentDestWP && isCloseEnough(10, person, currentDestWP)) {
            console.log('close to wp?');
            person.velocity.x = 0;
            person.velocity.y = 0;
            isMovingToWP = false;
            currentDestWP = null;
        }
    }

    const drawPoints = (points) => {
        points.forEach((p, i) => {
            if (i !== 0) {
                uts.handDraw(pg, p, points[i - 1]);
            }
        });
    }

    const draw = () => {
        p5Instance.image(pg, 200, 100);

        // pg.push();
        //pg.translate(200, 100);
        pg.background(255);

        me.position.x = p5Instance.mouseX;
        me.position.y = p5Instance.mouseY;

        me.maxSpeed = 5;
        it.maxSpeed = 5;

        followWayPoints(it, me);
        stopWayPoints(it);
        p5Instance.drawSprites();

        if (p5Instance.frameCount % 4 == 0) {
            pointsToDraw.push(
                p5Instance.createVector(it.position.x, it.position.y)
            );
        }


        drawRoom(pg, roomLeftTop, roomRightBottom);

        drawPoints(pointsToDraw);

        // back wall
        uts.drawHorizontalArea(
            pg,
            roomLeftTop,
            roomLeftBottom,
            roomRightTop,
            roomRightBottom,
            5
        );

        // left wall
        uts.drawVerticalArea(
            pg,
            screenLeftTop,
            screenLeftBottom,
            roomLeftTop,
            roomLeftBottom,
            10,
            {
                strokeWeight: 2
            }
        );

        // right wall
        uts.drawVerticalArea(
            pg,
            roomRightTop,
            roomRightBottom,
            screenRightTop,
            screenRightBottom,
            6
        );

        // ceiling
        uts.drawVerticalArea(
            pg, 
            screenLeftTop,
            roomLeftTop,
            screenRightTop,
            roomRightTop,
            10,             
            {
                strokeWeight: 1
            }
        );

        uts.drawHorizontalArea(
            pg, 
            screenRightTop,
            roomLeftTop,
            screenRightTop,
            roomRightTop,
            4,             
            {
                strokeWeight: 1
            }
        );

        // floor
        // uts.drawVerticalArea(
        //     pg,
        //     roomLeftBottom,
        //     screenLeftBottom,
        //     roomRightBottom,
        //     screenRightBottom,
        //     6
        // );

        // draw window
        uts.drawRecHorizontal(
            pg,
            p5Instance.createVector(500, 180),
            80, 
            120,
            3,
            {
                // color: [200, 200, 200],
                strokeWeight: 1
            }
        );

        uts.drawRecHorizontal(
            pg,
            p5Instance.createVector(590, 180),
            80, 
            120,
            3,
            {
                // color: [210, 200, 200],
                strokeWeight: 1
            }
        );

        uts.drawRecHorizontal(
            pg,
            p5Instance.createVector(500, 140),
            80, 
            30,
            3,
            {
                // color: [210, 200, 200],
                strokeWeight: 1
            }
        );

        uts.drawRecHorizontal(
            pg,
            p5Instance.createVector(590, 140),
            80, 
            30,
            3,
            {
                // color: [210, 200, 200],
                strokeWeight: 1
            }
        );

        // pg.pop();

    }


    const cleanup = () => {
        // p5.removeSprite(river);
    }


    return {
        start,
        draw,
        cleanup
    }

};