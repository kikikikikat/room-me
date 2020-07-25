import Level from './Level.js';
import LevelManager from './LevelManager.js';
import utils from './utils.js';

import level0 from './level-0.js';
import level1 from './level-1.js';
import level2 from './level-2.js';


import levelRiver from './level-river.js';
import levelFurniture from './level-furniture.js';
import levelFlowers from './level-flowers.js';
import levelMountains from './level-mountains.js';
import levelQuads from './level-quads.js';
import levelEmpty from './level-empty.js';
import levelTest from './level-test.js';
import levelRoom from './level-room.js';

import vants from './vants.js';

var patches = [];
  
  

new p5(p5Instance => {
    let uts = utils(p5Instance);

    for (let i = 0; i < 4; i++) {
        patches.push(vants(p5Instance));
    }

    let room, lightSwitch, drop, drop2, river;
    let isDarkMode = false;

    let SCREEN_WIDTH = 200;
    let SCREEN_HEIGHT = 150;
    p5Instance.preload = () => {
        // lightSwitch = p5Instance.createSprite(170, 320);
        // lightSwitch.scale = .4;
        // lightSwitch.addAnimation('day', 'assets/switch/frame_1.png', 'assets/switch/frame_4.png');
        // lightSwitch.addAnimation('dark', 'assets/switch-pressed/frame_1.png', 'assets/switch-pressed/frame_2.png');


        drop = p5Instance.createSprite(400, 300);
        drop.addAnimation('normal', 'assets/water-drop/frame_00001.png', 'assets/water-drop/frame_00017.png');
        // drop2 = p5Instance.createSprite(410, 300);
        // drop2.addAnimation('normal', 'assets/water-drop/frame_00001.png', 'assets/water-drop/frame_00017.png');
    }

    const toggleSwitch = () => {
        levelManager.next();
        isDarkMode = !isDarkMode;
        isDarkMode ? room.changeAnimation('dark') : room.changeAnimation('day');
        isDarkMode ? lightSwitch.changeAnimation('dark') : lightSwitch.changeAnimation('day');
    }

    let roomWPerc, roomHPerc;

    const drawCentralRoom = (wPerc, hPerc) => {
        let roomWidth = p5Instance.width * wPerc;
        let roomHeight = p5Instance.height * hPerc;
        let roomLeftTop = p5Instance.createVector((p5Instance.width - roomWidth) / 2, (p5Instance.height - roomHeight) / 2);
        let roomRightBottom = p5Instance.createVector((p5Instance.width + roomWidth) / 2, (p5Instance.height + roomHeight) / 2);
        uts.drawRoom(p5Instance, roomLeftTop, roomRightBottom);
    }

    p5Instance.setup = () => {
        p5Instance.rectMode(p5Instance.CENTER);
        p5Instance.createCanvas(p5Instance.windowWidth, p5Instance.windowHeight);
        roomWPerc = 0.15;
        roomHPerc = 0.4;

        //p5Instance.imageMode(p5Instance.CENTER);
        patches.forEach((p, i) => {
            let y = 0;
            if (i > 1) {
                y = 1;
            }
            p.contextPos = p5Instance.createVector(p5Instance.width * .1 + (i % 2) * 420, 100 + y * 250);
            p.start(p.contextPos.x , p.contextPos.y, SCREEN_WIDTH, SCREEN_HEIGHT);
        })

        // for (let i = 0; i < 3; i++) {
        //     for (let j = 0; j < 3; j++) {
        //         let p = patches[i + j];
        //         p.start(400 + (i % 3) * 100 , 200 + j * 100, 100, 100);
        //     }
        // }
        // lightSwitch.setCollider('circle', 0, 0, 64);
        // lightSwitch.onMousePressed = () => {
        //     console.log('pressed switch');
        //     levelManager.next();
        //     isDarkMode = !isDarkMode;
        //     isDarkMode ? room.changeAnimation('dark') : room.changeAnimation('day');
        //     isDarkMode ? lightSwitch.changeAnimation('dark') : lightSwitch.changeAnimation('day');
        // };
        // lightSwitch.onMouseOver = () => {
        //     console.log('mouseover switch');
        //     toggleSwitch();
        // }
        // lightSwitch.onMouseOut = () => {
        //     console.log('mouse out');
        //     toggleSwitch();
        // }
    };


    p5Instance.draw = () => {
        p5Instance.background(isDarkMode ? p5Instance.color(0, 0, 0) : p5Instance.color(255));
        drawCentralRoom(roomWPerc, roomHPerc);
        // p5Instance.drawSprite(room);
        // p5Instance.drawSprite(lightSwitch);
        p5Instance.drawSprite(drop);
        // p5Instance.tint(255, 120);
        // p5Instance.drawSprite(drop2);
        // levelManager.draw();
        // p5Instance.drawSprite(river);
        patches.forEach(p => {
            p.draw();
            console.log(p);
            uts.drawRec(
                p5Instance,
                p.contextPos,
                p5Instance.createVector(p.contextPos.x + SCREEN_WIDTH, p.contextPos.y + SCREEN_HEIGHT)
            )
        });




        //roomWPerc = p5Instance.noise(p5Instance.frameCount * .01);


        // if (p5Instance.frameCount > 30) {
        //     p5Instance.noLoop();
        // }
        p5Instance.text("X: "+ p5Instance.mouseX, 0, p5Instance.height/4);
        p5Instance.text("Y: "+ p5Instance.mouseY, 0, p5Instance.height/2);
    }

});

export default {

};


