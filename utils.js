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
            let offset = 2;
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

        context.stroke(60);
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
        let w = rightTop.x - leftTop.x;
        for (let x = 0; x < w; x += sep) {
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

    return {
        getColor,
        handDraw,
        drawHorizontalArea,
        drawRecHorizontal,
        drawVerticalArea
    }

};