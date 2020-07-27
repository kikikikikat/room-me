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

import DLAParticles from './DLAParticles.js';
import persons from './persons.js';

import levelWindows from './level-windows.js';

var patches = [];

var levelData = [ levelWindows ];
  

new p5(p5Instance => {
    let uts = utils(p5Instance);
    const levels = [];

    for (let i = 0; i < levelData.length; i++) {

        let level = new Level(i, levelData[i] && levelData[i](p5Instance));
        levels.push(level);
    }

    const levelManager = new LevelManager(levels);

    // patches = [
    //     persons(p5Instance, {initialSickPercentage: 0.1}),
    //     vants(p5Instance),
    //     DLAParticles(p5Instance),
    // ];

    let room, lightSwitch, drop, drop2, river;
    let isDarkMode = false;

    let SCREEN_WIDTH = 200;
    let SCREEN_HEIGHT = 150;

    let button;
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
        //p5Instance.createCanvas(p5Instance.windowWidth, p5Instance.windowHeight);
        p5Instance.createCanvas(1280, 720);
        roomWPerc = 0.15;
        roomHPerc = 0.4;

        levelManager.start();
        window.levelManager = levelManager;

        //p5Instance.imageMode(p5Instance.CENTER);
        // patches.forEach((p, i) => {
        //     let y = 0;
        //     if (i > 1) {
        //         y = 1;
        //     }
        //     p.contextPos = p5Instance.createVector(p5Instance.width * .1 + (i % 2) * 420, 100 + y * 250);
        //     p.start(p.contextPos.x , p.contextPos.y, SCREEN_WIDTH, SCREEN_HEIGHT);
        // })

        button = p5Instance.createButton('click me');
        button.position(p5Instance.width / 2 - 20, p5Instance.height * .8);
        button.mousePressed(()=> {
            console.log('clciked button!');
        });

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

    p5Instance.mouseMoved = () => {
        levelManager.mouseMoved();
    }


    p5Instance.draw = () => {
        p5Instance.background(isDarkMode ? p5Instance.color(0, 0, 0) : p5Instance.color(255));
        drawCentralRoom(roomWPerc, roomHPerc);
        // p5Instance.drawSprite(lightSwitch);
        p5Instance.drawSprite(drop);
        // p5Instance.tint(255, 120);
        // p5Instance.drawSprite(drop2);
        levelManager.draw();
        // p5Instance.drawSprite(river);
        // patches.forEach(p => {
        //     p.draw();
        //     uts.drawRec(
        //         p5Instance,
        //         p.contextPos,
        //         p5Instance.createVector(p.contextPos.x + SCREEN_WIDTH, p.contextPos.y + SCREEN_HEIGHT)
        //     )
        // });

        // if (p5Instance.mouseX > 500) {
        //     p5Instance.cursor('grab');
        // } else {
        //     p5Instance.cursor('cell');
        // }

        p5Instance.push();
        p5Instance.translate(400, 500);
        p5Instance.rotate(p5Instance.frameCount * .1);
        uts.drawRadiantLines(p5Instance, 5, 10, 50, p5Instance.TWO_PI * .3);
        p5Instance.pop();




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


