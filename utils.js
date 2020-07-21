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

    const handDraw = (context, p1, p2) => {
        p5Instance.randomSeed(p5Instance.frameCount * p1.x * p1.y);
        // context.stroke(200, 0, 0);
        context.strokeWeight(1);
        let points = [];
        let dist = p5.Vector.sub(p2, p1).mag();
        for (let i = 0; i < dist; i+=20) {
            let dir = p5.Vector.sub(p2, p1).normalize();;
            let rotateNoise = p5Instance.map(p5Instance.noise(p5Instance.random(300)), 0, 1, -p5Instance.radians(.1), p5Instance.radians(.1));
            let adjustedDir = dir.rotate(rotateNoise);
            let p = p5.Vector.add(p1, p5.Vector.mult(adjustedDir, i));
            
            let noise = p5Instance.noise(i + p5Instance.random(1000));
            let noise2 = p5Instance.noise(i + p5Instance.random(1000));
            let offset = 2;
            p.x = p5Instance.map(noise, 0, 1, p.x - offset, p.x + offset);
            p.y = p5Instance.map(noise2, 0, 1, p.y - offset, p.y + offset);
            points.push(p);
        }

        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let nextP;
            if (i != points.length - 1) {
                nextP = points[i + 1];
                context.line(p.x, p.y, points[i+1].x, points[i + 1].y);
            }
        }
    }

    return {
        getColor,
        handDraw
    }

};