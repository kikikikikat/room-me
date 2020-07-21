
import utils from './utils.js';
import main from './main.js';


export default p5Instance => {

    let pg, mask, uts = utils(p5Instance);

    const start = () => {
        pg = p5Instance.createGraphics(630, 400, p5Instance.WEBGL);
        mask = p5Instance.createGraphics(1280, 720);
        mask.colorMode(p5Instance.HSB, 360, 100, 100, 100);
    }

    // const getDir = (i, points, p1, p2) => {
    //     let base = p1;
    //     let end = p2;
    //     let dir = p5.Vector.sub(end, base).normalize();
    //     return dir;
    // }
     
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

    // const handDraw = (context, p1, p2) => {
    //     p5Instance.randomSeed(p5Instance.frameCount * p1.x * p1.y);
    //     context.stroke(200, 0, 0);
    //     context.strokeWeight(1);
    //     let points = [];
    //     let dist = p5.Vector.sub(p2, p1).mag();
    //     for (let i = 0; i < dist; i+=20) {
    //         let dir = getDir(i, points, p1, p2);
    //         let rotateNoise = p5Instance.map(p5Instance.noise(p5Instance.random(300)), 0, 1, -p5Instance.radians(.6), p5Instance.radians(.6));
    //         let adjustedDir = dir.rotate(rotateNoise);
    //         let p = p5.Vector.add(p1, p5.Vector.mult(adjustedDir, i));
            
    //         let noise = p5Instance.noise(i + p5Instance.random(1000));
    //         let noise2 = p5Instance.noise(i + p5Instance.random(2000));
    //         p.x = p5Instance.map(noise, 0, 1, p.x - 3, p.x + 3);
    //         p.y = p5Instance.map(noise2, 0, 1, p.y - 3, p.y + 3);
    //         points.push(p);
    //     }

    //     for (let i = 0; i < points.length; i++) {
    //         let p = points[i];
    //         let nextP;
    //         if (i != points.length - 1) {
    //             nextP = points[i + 1];
    //             context.line(p.x, p.y, points[i+1].x, points[i + 1].y);
    //         }
    //     }
    // }

    const drawRec = (context, leftTop, rightBottom) => {
        let leftBottom = p5Instance.createVector(leftTop.x, rightBottom.y);
        let rightTop = p5Instance.createVector(rightBottom.x, leftTop.y);
        handDraw(context, leftTop, rightTop);
        handDraw(context, leftTop, rightBottom);

        handDraw(context, leftTop, leftBottom);
        handDraw(context, rightTop, rightBottom);
    }

    const draw = () => {
        //p5Instance.image(mask, 320, 172);
        p5Instance.image(mask, 0, 0);
        let lt = p5Instance.createVector(200, 2);
        let rb = p5Instance.createVector(550, 330);
        mask.background(255);

        let lt1 = p5Instance.createVector(50, 50);
        let rb1 = p5Instance.createVector(500, 290);
        // handDrawVertical(mask, pt1, pt2);

        // drawRec(mask, lt, rb);
        // drawRec(mask, lt1, rb1);

        //handDraw(mask, p5Instance.createVector(200, 100), p5Instance.createVector(700, 400));

        mask.push();
        mask.translate(500, 500);
        drawRadiantLines(mask);
        mask.pop();

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