import utils from './utils.js';

export default p5Instance => {


    let isDarkMode = false;
    let uts = utils(p5Instance);

    let swimmers = [];

    let tx = 0;


    const start = () => {

        for (let i = 0; i < 10; i++) {
            let x = p5Instance.random(100, p5Instance.width - 100);
            let y = p5Instance.random(100, p5Instance.height - 100);
            swimmers.push(createSwimmer(x, y));
        }



    }

    const createSwimmer = (x, y) => {
        let sprite = p5Instance.createSprite(x || p5Instance.width / 2, y || p5Instance.height / 2);
        sprite.addAnimation('swimming', 'assets/level-swim/swimmer/frame_00001.png', 'assets/level-swim/swimmer/frame_00012.png');
        sprite.velocity.y = p5Instance.random(-1, -0.1);
        sprite.scale = p5Instance.random(0.05, .8);
        sprite.onMouseOver = () => {
            console.log('swimming!');
        }
        return sprite;
    }

    const drawSwimming = (swimmer) => {

        p5Instance.push();
        // p5Instance.rotate(stepDir());
        p5Instance.fill(60);

        swimmer.rotation = 0;
        if (swimmer.position.x > p5Instance.width) {
            swimmer.position.x = 10;
        } else if (swimmer.position.x < 0) {
            swimmer.position.x = p5Instance.width - 10
        }
        if (swimmer.position.y > p5Instance.height) {
            swimmer.position.y = 0;
        } else if (swimmer.position.y < 0) {
            swimmer.position.y = p5Instance.height - 10
        }
        let color = (1 - swimmer.scale) * 255;
        uts.drawRecVertical(
            p5Instance,
            p5Instance.createVector(-75 * swimmer.scale + swimmer.position.x, -100 * swimmer.scale + swimmer.position.y),
            150 * swimmer.scale, 
            200 * swimmer.scale,
            10,
            {
                offset: 8,
                color: [color, color, color]
            }
        );
        p5Instance.drawSprite(swimmer);
        p5Instance.pop();
    }

    const stepDir = () => {
        let x = p5Instance.map(p5Instance.noise(tx), 0, 1, 0, 10);   
        tx += 0.0005;

        return x;
    }




    const draw = () => {
        p5Instance.background(isDarkMode ? 20 : 240);
        p5Instance.stroke(isDarkMode ? 240 : 20);

        swimmers.forEach(s => {
            drawSwimming(s);
        })
 
        
    }


    const cleanup = () => {

    }


    return {
        start,
        draw,
        cleanup
    }

};