
import utils from './utils.js';
import main from './main.js';

import vants from './vants.js';
import DLAParticles from './DLAParticles.js';

import Micro from './Micro.js';


export default p5Instance => {

    let pg, linesPg, stairs, uts = utils(p5Instance);
    let scaleFactor = 0.8;

    let sphere, area;

    let micros = [];
    let offsetX = 120;
    let offsetY = -10;
    
    let center1 = p5Instance.createVector(518, 205);

    const start = () => {
        pg = p5Instance.createGraphics(p5Instance.width, p5Instance.height);
        sphere = p5Instance.createSprite(p5Instance.width / 2, 320);
        sphere.addImage('default', p5Instance.loadImage('assets/level-biosphere/sphere.png'));
        sphere.scale = scaleFactor;

        area = p5Instance.loadImage('assets/level-biosphere/area.png');
        area.resize(576, 576);

    }

    p5Instance.mouseClicked = () => {
        console.log('mouse pressed');
        let newMicro = new Micro(
            p5Instance, 
            p5Instance.mouseX, 
            p5Instance.mouseY, 
            pg,
            {
                center: center1,
                area: area
            }
        );
        micros.push(newMicro);

        let color = uts.getColor(area, p5Instance.mouseX - offsetX, p5Instance.mouseY - offsetY);
        if (!color) return;
        if (color == 'red') {
            console.log('this is red');
        } else if (color == 'green') {
            console.log('gr');
        }
    }

    const draw = () => {
        //pg.background(255, 255, 255);
        let pgX = p5Instance.windowWidth / 2 - pg.width / 2;
        let pgY = p5Instance.windowHeight / 2 - pg.height / 2;
        p5Instance.image(pg, pgX, pgY);
        pg.background(255, 255, 255);

        micros.forEach(m => {
            m.draw();
        });
        pg.updatePixels();

        p5Instance.drawSprites();


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