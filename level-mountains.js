
import utils from './utils.js';
import main from './main.js';

// https://www.openprocessing.org/sketch/857874

let pallete = ["#4D6F83", "#B1B0B1", "#278DD3", "#F8B623", "#3C494F", "#D51311", "#02020C"];
let sep = 3;
let rs;


export default p5 => {

    let pg;

    const drawMountains = (context) => {
        let height = context.height, width = context.width;
        context.drawingContext.shadowColor = p5.color(0, 0, 0);
        context.drawingContext.shadowBlur = 100;
        context.drawingContext.shadowOffsetY = 50;
        context.drawingContext.shadowOffsetX = 0;
        
        for (let y = -height/2; y < height; y += height / 10) {
          let c1 = p5.random(pallete);
          let c2 = p5.random(pallete);
          let c3 = p5.random(pallete);
          while (c1 == c2 || c2 == c3 || c3 == c1) {
            c1 = p5.random(pallete);
            c2 = p5.random(pallete);
            c3 = p5.random(pallete);
          }

          let gradient = context.drawingContext.createLinearGradient(0, 0, width, 0);
      
          gradient.addColorStop(0.0, c1);
          gradient.addColorStop(p5.random(0.3,0.7), c2);
          gradient.addColorStop(1.0, c3);

          context.drawingContext.fillStyle = gradient;
          context.noStroke();
          context.beginShape();
          for (let x = -200; x <= width+200; x+=3) {
            let yy = y + p5.map(p5.noise(rs+y, x / 400, p5.frameCount / 300), 0, 1, -height / sep, height / sep);
            context.vertex(x, yy);
          }
          context.vertex(width+200, height);
          context.vertex(0-200, height);
          context.endShape();
        }
    }

    const start = () => {
        pg = p5.createGraphics(630, 400);
        rs = p5.random(10000);
    }

    const draw = () => {

        p5.randomSeed(rs);
        
        drawMountains(pg);
        p5.image(pg, 290, 140);

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