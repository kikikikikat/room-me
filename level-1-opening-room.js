import utils from './utils.js';

export default p5Instance => {

    let uts = utils(p5Instance);

    let lightSwitch;
    let isDarkMode = false;

    const roomWPerc = 0.35;
    const roomHPerc = 0.4;

    let showText = false;

    const text = 'The Room'


    const drawCentralRoom = (wPerc, hPerc) => {
        let roomWidth = p5Instance.width * wPerc;
        let roomHeight = p5Instance.height * hPerc;
        let roomLeftTop = p5Instance.createVector((p5Instance.width - roomWidth) / 2, (p5Instance.height - roomHeight) / 2);
        let roomRightBottom = p5Instance.createVector((p5Instance.width + roomWidth) / 2, (p5Instance.height + roomHeight) / 2);
        uts.drawRoom(p5Instance, roomLeftTop, roomRightBottom);
    }

    const toggleSwitch = () => {
        isDarkMode = !isDarkMode;
        isDarkMode ? lightSwitch.changeAnimation('dark') : lightSwitch.changeAnimation('light');

        setTimeout(() => {
            showText = true;
        }, 1000);
    }

    const start = () => {
        lightSwitch = p5Instance.createSprite(170, 320);
        lightSwitch.scale = .4;
        lightSwitch.addAnimation('light', 'assets/switch/frame_1.png', 'assets/switch/frame_4.png');
        lightSwitch.addAnimation('dark', 'assets/switch-pressed/frame_1.png', 'assets/switch-pressed/frame_2.png');
        lightSwitch.setCollider('circle', 0, 0, 100);
        lightSwitch.onMouseOver = () => {
            p5Instance.cursor('pointer');
        }
        lightSwitch.onMouseOut = () => {
            p5Instance.cursor('default');
        }
        lightSwitch.onMouseReleased = () => {
            console.log('switch pressed');
            toggleSwitch();
        }

    }

    p5Instance.mouseClicked = () => {
        console.log('mouse pressed');

    }

    const draw = () => {
        p5Instance.background(isDarkMode ? 20 : 240);
        p5Instance.stroke(isDarkMode ? 240 : 20);
        drawCentralRoom(roomWPerc, roomHPerc);
        p5Instance.drawSprite(lightSwitch);

        if (showText) {
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(128 + p5Instance.sin(p5Instance.frameCount*0.01) * 128);
            p5Instance.textSize(16);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
        }
    }


    const cleanup = () => {

    }


    return {
        start,
        draw,
        cleanup
    }

};