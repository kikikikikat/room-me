
import utils from './utils.js';
import main from './main.js';


export default p5Instance => {

    let pg, me, it, uts = utils(p5Instance);

    const start = () => {
        pg = p5Instance.createGraphics(1280, 720);
        me = drawSomething('me', p5Instance.mouseX, p5Instance.mouseY);
        it = drawSomething('it', 300, 300);
    }
     
    const drawRadiantLines = (context) => {
        let n = 100;
        //draw a line perpendicular to a circle that has the length of the steps done each day.
        for (let i = 0; i < n; i++) {
            let angle = p5Instance.map(i,0,n,0,p5Instance.TWO_PI);//equally spacing lines along the circle.
            let lineLength = 200;
            let radius = 20; //radius of the internal cycle.
            let x1 = radius * p5Instance.cos(angle);
            let y1 = radius * p5Instance.sin(angle);
            let x2 = (radius + lineLength) * p5Instance.cos(angle);
            let y2 = (radius+lineLength) * p5Instance.sin(angle);
            //context.line(x1,y1,x2,y2);
            uts.handDraw(context, p5Instance.createVector(x1, y1), p5Instance.createVector(x2, y2));
        }

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


    const intersect_point = (point1, point2, point3, point4) => {
        const ua = ((point4[0] - point3[0]) * (point1[1] - point3[1]) - 
                (point4[1] - point3[1]) * (point1[0] - point3[0])) /
                ((point4[1] - point3[1]) * (point2[0] - point1[0]) - 
                (point4[0] - point3[0]) * (point2[1] - point1[1]));
    
        const ub = ((point2[0] - point1[0]) * (point1[1] - point3[1]) - 
                    (point2[1] - point1[1]) * (point1[0] - point3[0])) /
                    ((point4[1] - point3[1]) * (point2[0] - point1[0]) - 
                    (point4[0] - point3[0]) * (point2[1] - point1[1]));
        
        const x = point1[0] + ua * (point2[0] - point1[0]);
        const y = point1[1] + ua * (point2[1] - point1[1]);
        
        return [x, y]
    }

    // const drawHorizontalArea = (context, leftPoint, rightPoint, h, sep) => {
    //     for (let y = 0; y < h; y+=sep) {
    //         let p1 = p5Instance.createVector(leftPoint.x, leftPoint.y + y);
    //         let p2 = p5Instance.createVector(rightPoint.x, rightPoint.y + y);
    //         uts.handDraw(context, p1, p2);
    //     }
    // }

    const drawVerticalArea = (context, leftTop, leftBottom, rightTop, rightBottom, sep) => {
        let w = rightTop.x - leftTop.x;
        for (let x = 0; x < w; x += sep) {
            let topP = intersect_point([leftTop.x + x, 0], [leftTop.x + x, context.height], [leftTop.x, leftTop.y], [rightTop.x, rightTop.y]);
            let bottomP = intersect_point([leftBottom.x + x, 0], [leftBottom.x + x, context.height], [leftBottom.x, leftBottom.y], [rightBottom.x, rightBottom.y]);
            uts.handDraw(context, p5Instance.createVector(topP[0], topP[1]), p5Instance.createVector(bottomP[0], bottomP[1]));
        }
    }

    const drawHorizontalArea = (context, leftTop, leftBottom, rightTop, rightBottom, sep) => {
        let h = leftBottom.y - leftTop.y;
        for (let y = 0; y < h; y += sep) {
            let leftP = intersect_point([0, leftTop.y + y], [context.width, leftTop.y + y], [leftTop.x, leftTop.y], [leftBottom.x, leftBottom.y]);
            let rightP = intersect_point([0, rightTop.y + y], [context.width, rightTop.y + y], [rightTop.x, rightTop.y], [rightBottom.x, rightBottom.y]);
            uts.handDraw(context, p5Instance.createVector(leftP[0], leftP[1]), p5Instance.createVector(rightP[0], rightP[1]));
        }
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

        uts.handDraw(context, scrnLeftTop, leftTop);
        uts.handDraw(context, scrnRightTop, rightTop);
        uts.handDraw(context, scrnLeftBottom, leftBottom);
        uts.handDraw(context, scrnRightBottom, rightBottom);
    }

    const isCloseEnough = (threshold, a, b) => {
        let aPos = a instanceof p5.Vector ? a : p5Instance.createVector(a.position.x, a.position.y);
        let bPos = b instanceof p5.Vector ? b : p5Instance.createVector(b.position.x, b.position.y);
        let dist = p5.Vector.dist(aPos, bPos);
        return dist <= threshold;
    }

    // const avoid = (avoider, chaser) => {
    //     let avoiderPos = p5Instance.createVector(avoider.position.x, avoider.position.y);
    //     let chasderPos = p5Instance.createVector(chaser.position.x, chaser.position.y);

    //     let dir;

    //     // TODO: need better avoiding direction
    //     if (isCloseEnough(200, avoider, chaser)) {
    //         dir = p5.Vector.sub(avoiderPos, chasderPos);
    //         let angle = avoiderPos.angleBetween(dir.normalize());
    //         avoider.rotation += angle;
    //         console.log(avoider.rotation);
    //         avoider.setSpeed(4, avoider.rotation);
    //     } else {
    //         avoider.setSpeed(0, avoider.rotation);
    //     }
    // }

    let wayPoints = [
        p5Instance.createVector(100, 500),
        p5Instance.createVector(300, 700),
        p5Instance.createVector(600, 100)
    ];

    let isMovingToWP = false;
    let currentDestWP = null;
    const followWayPoints = (avoider, chaser) => {
        if (isCloseEnough(120, avoider, chaser)) {
            if (wayPoints.length > 0 && !isMovingToWP) {
                currentDestWP = wayPoints.shift();
                console.log('new wp', currentDestWP);
                avoider.attractionPoint(5, currentDestWP.x, currentDestWP.y);
                isMovingToWP = true;
            }
        }
    }

    const stopWayPoints = (person) => {

        if (isMovingToWP && currentDestWP && isCloseEnough(60, person, currentDestWP)) {
            console.log('close to wp?');
            person.velocity.x = 0;
            person.velocity.y = 0;
            isMovingToWP = false;
            currentDestWP = null;
        }
    }

    const draw = () => {
        //p5Instance.image(mask, 320, 172);
        p5Instance.image(pg, 0, 0);
        pg.background(255);

        pg.push();
        pg.translate(500, 500);
        drawRadiantLines(pg);
        pg.pop();


        me.position.x = p5Instance.mouseX;
        me.position.y = p5Instance.mouseY;
        //it.attractionPoint(0.7, p5Instance.mouseX, p5Instance.mouseY);
        me.maxSpeed = 5;
        it.maxSpeed = 5;

        followWayPoints(it, me);
        stopWayPoints(it);

        // avoid(it, me);

        //me.displace(it);
        p5Instance.drawSprites();



        drawRoom(pg, p5Instance.createVector(240, 140), p5Instance.createVector(840, 440));

        // drawHorizontalArea(pg, p5Instance.createVector(240, 140), p5Instance.createVector(840, 340), 300, 3);

        
        uts.drawHorizontalArea(
            pg, 
            p5Instance.createVector(200, 140),
            p5Instance.createVector(20, 540),
            p5Instance.createVector(400, 140),
            p5Instance.createVector(500, 540),
            5
        );

        // drawVerticalArea(
        //     pg, 
        //     p5Instance.createVector(20, 140),
        //     p5Instance.createVector(20, 540),
        //     p5Instance.createVector(300, 240),
        //     p5Instance.createVector(300, 340),
        //     5
        // );

        p5Instance.text("X: "+ p5Instance.mouseX, 0, p5Instance.height/4);
        p5Instance.text("Y: "+ p5Instance.mouseY, 0, p5Instance.height/2);
        //p5Instance.noLoop();

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