export default (p5Instance) => {

    const getColor = (area, mouseX, mouseY) => {        
        let x = mouseX || p5Instance.mouseX;
        let y = mouseY || p5Instance.mouseY;
        let result = '';
        let [r, g, b, a] = area.get(x, y);
        if (r > 200 && g < 50 && b < 50) {
            result = 'red';
        } else if (r < 50 && g > 200 && b < 50) {
            result = 'green';
        } else if (r < 50 && g < 50 && b > 200) {
            result = 'blue';
        } else if (r > 200 && g > 200 && b < 50) {
            result = 'yellow';
        } else if (r > 200 && g < 50 && b > 200) {
            result = 'pink';
        }
        return result;
    };

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

    const handDraw = (context, p1, p2, opts) => {
        p5Instance.randomSeed(p5Instance.frameCount * p1.x * p1.y);
        var opts = opts || {};
        
        let offset = opts.offset || 2;
        context.strokeWeight(opts.strokeWeight || 1);
        if (opts.color) {
            context.stroke(opts.color[0], opts.color[1], opts.color[2], 255);
        }

        let points = [];
        let dist = p5.Vector.sub(p2, p1).mag();
        for (let i = 0; i < dist; i+=20) {
            let dir = p5.Vector.sub(p2, p1).normalize();;
            let rotateNoise = p5Instance.map(p5Instance.noise(p5Instance.random()), 0, 1, -p5Instance.radians(.5), p5Instance.radians(.5));
            let adjustedDir = dir.rotate(rotateNoise);
            let p = p5.Vector.add(p1, p5.Vector.mult(adjustedDir, i));
            
            let noise = p5Instance.noise(i + p5Instance.random(1000));
            let noise2 = p5Instance.noise(i + p5Instance.random(1000));
            
            p.x = p5Instance.map(noise, 0, 1, p.x - offset, p.x + offset);
            p.y = p5Instance.map(noise2, 0, 1, p.y - offset, p.y + offset);
            points.push(p);
        }

        points.push(p2);

        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let nextP;
            if (i != points.length - 1) {
                nextP = points[i + 1];
                context.line(p.x, p.y, points[i+1].x, points[i + 1].y);
            }
        }
    }

    const drawHorizontalArea = (context, leftTop, leftBottom, rightTop, rightBottom, sep, opts) => {
        let h = leftBottom.y - leftTop.y;
        for (let y = 0; y < h; y += sep) {
            let leftP = intersect_point([0, leftTop.y + y], [context.width, leftTop.y + y], [leftTop.x, leftTop.y], [leftBottom.x, leftBottom.y]);
            let rightP = intersect_point([0, rightTop.y + y], [context.width, rightTop.y + y], [rightTop.x, rightTop.y], [rightBottom.x, rightBottom.y]);
            handDraw(context, p5Instance.createVector(leftP[0], leftP[1]), p5Instance.createVector(rightP[0], rightP[1]), opts);
        }
    }

    const drawVerticalArea = (context, leftTop, leftBottom, rightTop, rightBottom, sep, opts) => {
        var opts = opts || {};
        let w = rightTop.x - leftTop.x;
        let xStart = opts.xStart || 0;
        for (let x = xStart; x < w; x += sep) {
            let topP = intersect_point([leftTop.x + x, 0], [leftTop.x + x, context.height], [leftTop.x, leftTop.y], [rightTop.x, rightTop.y]);
            let bottomP = intersect_point([leftBottom.x + x, 0], [leftBottom.x + x, context.height], [leftBottom.x, leftBottom.y], [rightBottom.x, rightBottom.y]);
            handDraw(context, p5Instance.createVector(topP[0], topP[1]), p5Instance.createVector(bottomP[0], bottomP[1]), opts);
        }
    }

    const drawRecHorizontal = (context, origin, w, h, sep, opts) => {
        let leftTop = origin;
        let leftBottom = p5Instance.createVector(origin.x, origin.y + h);
        let rightTop = p5Instance.createVector(origin.x + w, origin.y);
        let rightBottom = p5Instance.createVector(origin.x + w, origin.y + h);
        drawHorizontalArea(context, leftTop, leftBottom, rightTop, rightBottom, sep, opts);
    }

    const drawRecVertical = (context, origin, w, h, sep, opts) => {
        let leftTop = origin;
        let leftBottom = p5Instance.createVector(origin.x, origin.y + h);
        let rightTop = p5Instance.createVector(origin.x + w, origin.y);
        let rightBottom = p5Instance.createVector(origin.x + w, origin.y + h);
        drawVerticalArea(context, leftTop, leftBottom, rightTop, rightBottom, sep, opts);
    }

    const drawRec = (context, leftTop, rightBottom) => {
        let leftBottom = p5Instance.createVector(leftTop.x, rightBottom.y);
        let rightTop = p5Instance.createVector(rightBottom.x, leftTop.y);

        handDraw(context, leftTop, rightTop);
        handDraw(context, rightTop, rightBottom);
        handDraw(context, leftTop, leftBottom);
        handDraw(context, leftBottom, rightBottom);
    }

    const drawRoom = (context, leftTop, rightBottom) => {
        let screenLeftTop = p5Instance.createVector(0, 0),
            screenLeftBottom = p5Instance.createVector(0, context.height),
            screenRightTop = p5Instance.createVector(context.width, 0),
            screenRightBottom = p5Instance.createVector(context.width, context.height);

        let leftBottom = p5Instance.createVector(leftTop.x, rightBottom.y);
        let rightTop = p5Instance.createVector(rightBottom.x, leftTop.y);


        drawRec(context, leftTop, rightBottom);

        handDraw(context, screenLeftTop, leftTop);
        handDraw(context, screenRightTop, rightTop);
        handDraw(context, screenLeftBottom, leftBottom);
        handDraw(context, screenRightBottom, rightBottom);
    }

    const drawRadiantLines = (context, x, y, numOfLines, radius, lineLength, opts, radians) => {
        //draw a line perpendicular to a circle that has the length of the steps done each day.
        for (let i = 0; i < numOfLines; i++) {
            let angle = p5Instance.map(i,0,numOfLines,0, radians || p5Instance.TWO_PI);//equally spacing lines along the circle.
             //radius = the internal cycle.
            let distortion = opts.distortion || 0;
            let start = opts.start || 0;
            let x1 = (x || 0) + radius * p5Instance.cos(angle + start);
            let y1 = (y || 0) + radius * p5Instance.sin(angle + start);
            let x2 = (x || 0) + (radius + lineLength) * p5Instance.cos(angle + distortion + start);
            let y2 = (y || 0) + (radius+lineLength) * p5Instance.sin(angle + distortion + start);
            //context.line(x1,y1,x2,y2);
            handDraw(context, p5Instance.createVector(x1, y1), p5Instance.createVector(x2, y2), opts);
        }

    }

    const isCloseEnough = (threshold, a, b) => {
        let aPos = a instanceof p5.Vector ? a : this.p5.createVector(a.position.x, a.position.y);
        let bPos = b instanceof p5.Vector ? b : this.p5.createVector(b.position.x, b.position.y);
        let dist = p5.Vector.dist(aPos, bPos);
        return dist <= threshold;
    }

    return {
        getColor,
        isCloseEnough,
        handDraw,
        drawHorizontalArea,
        drawRecHorizontal,
        drawRecVertical,
        drawVerticalArea,
        drawRadiantLines,
        drawRoom,
        drawRec
    }

};