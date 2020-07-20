
import utils from './utils.js';

class Line {
    constructor(x, y, height, grayScale) {
        this.x = x;
        this.y = y;
        // this.midPoint = [p5.random(-2, 2), height / 2.0];
        this.height = height;
        this.grayScale = grayScale;
    }

    draw(p5) {
        p5.strokeWeight(2);
        p5.stroke(this.grayScale, this.grayScale, this.grayScale);
        p5.push();
        p5.translate(this.x, this.y);
        p5.scale(p5.map(this.grayScale, 0, 255, 1, .2));
        p5.beginShape();
        p5.vertex(0, 0);
        p5.vertex(p5.random(-2, 2), p5.random(-2, 2));
        
        p5.vertex(p5.random(-5, 2), this.height / 2.0);
        p5.vertex(p5.random(-5, 2), this.height);
        p5.endShape();
        p5.pop();
        p5.strokeWeight(1);
    }
}

export default p5 => {

    let river, area;

    let lines = [];

    let uts = utils(p5);


    const start = () => {
        river = p5.createSprite(640, 360);
        river.addAnimation('normal', 'assets/river/frame_00001.png', 'assets/river/frame_00005.png');
        area = p5.loadImage('assets/river/river-area.png');
    }

    p5.mouseMoved = () => {
        let color = uts.getColor(area);
        if (!color) return;
        let lineColor;
        if (color === 'red') {
            lineColor = 20;
        } else if (color === 'green') {
            lineColor = 120;
        } else if (color == 'yellow') {
            lineColor = 160;
        } else if (color == 'pink') {
            lineColor = 200;
        } else if (color == 'blue') {
            color = 220;
        }
        lines.push(new Line(p5.mouseX, p5.mouseY, 30, lineColor));
    }

    const draw = () => {
        p5.drawSprite(river);
        // p5.text("X: "+ p5.mouseX, 0, p5.height/4);
        // p5.text("Y: "+ p5.mouseY, 0, p5.height/2);
        lines.forEach(line => {
            line.draw(p5);
        });

    }


    const cleanup = () => {
        console.log('clean up river');
        p5.removeSprite(river);
    }


    return {
        start,
        draw,
        cleanup: cleanup
    }

};