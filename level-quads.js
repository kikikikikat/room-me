
import utils from './utils.js';
import main from './main.js';


export default p5Instance => {

    let pg, mask;

    const start = () => {
        pg = p5Instance.createGraphics(630, 400, p5Instance.WEBGL);
        //mask = p5Instance.createGraphics(560, 340);
        mask = p5Instance.createGraphics(1280, 720);
        mask.colorMode(p5Instance.HSB, 360, 100, 100, 100);

        //mask.noStroke();
        // mask.beginShape();
        // mask.vertex(0, 0);
        // mask.vertex(0, mask.height);
        // mask.vertex(mask.width, mask.height);
        // mask.vertex(mask.width, 0);
        // mask.endShape();
    }

    const handDrawHorizontal = (context, p1, p2) => {
        p5Instance.randomSeed(p5Instance.frameCount);
        context.stroke(200, 0, 0);
        context.strokeWeight(2);
        let points = [];
        for (let x = p1.x - 1; x <= p2.x+1; x+=20) {
            let noise = p5Instance.noise(x + p5Instance.random(1000));
            let y = p5Instance.map(noise, 0, 1, p2.y - 5, p2.y + 5);
            points.push([x, y]);
        }
        points.forEach((p, i) => {
            if (i != points.length - 1) {
                context.line(p[0], p[1], points[i+1][0], points[i + 1][1]);
            }
        })
    }

    const getDir = (i, points, p1, p2) => {
        let base = p1;
        let end = p2;
        let dir = p5.Vector.sub(end, base).normalize();
        return dir;
    }

    const handDraw = (context, p1, p2) => {
        p5Instance.randomSeed(p5Instance.frameCount);
        context.stroke(200, 0, 0);
        context.strokeWeight(2);
        let points = [];
        let heading = p5.Vector.sub(p2, p1);
        let dist = heading.mag();
        // let dir = heading.normalize();
        // console.log(dir.mult(10));
        for (let i = 0; i < dist; i+=20) {
            //let heading = p5.Vector.sub(p2, p1);
            let dir = getDir(i, points, p1, p2);
            let rotateNoise = p5Instance.map(p5Instance.noise(p5Instance.random(300)), 0, 1, -p5Instance.radians(.6), p5Instance.radians(.6));
            let adjustedDir = dir.rotate(rotateNoise);
            let p = p5.Vector.add(p1, p5.Vector.mult(adjustedDir, i));
            
            let noise = p5Instance.noise(i + p5Instance.random(1000));
            let noise2 = p5Instance.noise(i + p5Instance.random(2000));
            p.x = p5Instance.map(noise, 0, 1, p.x - 3, p.x + 3);
            p.y = p5Instance.map(noise2, 0, 1, p.y - 3, p.y + 3);
            points.push(p);
        }

        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let nextP;
            if (i != points.length - 1) {
                // console.log(p);
                nextP = points[i + 1];
                context.line(p.x, p.y, points[i+1].x, points[i + 1].y);
            }
        }
    }

    const handDrawVertical = (context, p1, p2) => {
        //p5Instance.randomSeed(p5Instance.frameCount);
        context.stroke(200, 0, 0);
        context.strokeWeight(2);
        let points = [];
        for (let y = p1.y - 1; y <= p2.y+1; y+=20) {
            let noise = p5Instance.noise(y + p5Instance.random(1000));
            let x = p5Instance.map(noise, 0, 1, p2.x - 5, p2.x + 5);
            points.push([x, y]);
        }
        points.forEach((p, i) => {
            if (i != points.length - 1) {
                context.line(p[0], p[1], points[i+1][0], points[i + 1][1]);
            }
        })
    }

    const drawRec = (context, leftTop, rightBottom) => {
        let leftBottom = p5Instance.createVector(leftTop.x, rightBottom.y);
        let rightTop = p5Instance.createVector(rightBottom.x, leftTop.y);
        handDrawHorizontal(context, leftTop, rightTop);
        handDrawHorizontal(context, leftTop, rightBottom);

        handDrawVertical(context, leftTop, leftBottom);
        handDrawVertical(context, rightTop, rightBottom);
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

        drawRec(mask, lt, rb);
        drawRec(mask, lt1, rb1);

        handDraw(mask, p5Instance.createVector(200, 100), p5Instance.createVector(700, 400));

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