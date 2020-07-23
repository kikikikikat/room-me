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

var mouseOverWhichRoomArea= 3, levelData = [ vants ];
  
  

new p5(p5 => {
    const levels = [];
    let roomArea;
    let uts = utils(p5);
    for (let i = 0; i < levelData.length; i++) {

        let level = new Level(i, levelData[i] && levelData[i](p5));
        levels.push(level);
    }

    const levelManager = new LevelManager(levels);
    let room, lightSwitch, drop, drop2, river;
    let isDarkMode = false;
    p5.preload = () => {
        // lightSwitch = p5.createSprite(170, 320);
        // lightSwitch.scale = .4;
        // lightSwitch.addAnimation('day', 'assets/switch/frame_1.png', 'assets/switch/frame_4.png');
        // lightSwitch.addAnimation('dark', 'assets/switch-pressed/frame_1.png', 'assets/switch-pressed/frame_2.png');

        // room = p5.createSprite(640, 360);
        // room.addAnimation('day', 'assets/room/frame_1.png', 'assets/room/frame_4.png');
        // room.addAnimation('dark', 'assets/room-invert/frame_1.png', 'assets/room-invert/frame_4.png');

        // roomArea = p5.loadImage('assets/room-area.png');

        // drop = p5.createSprite(400, 300);
        // drop.addAnimation('normal', 'assets/water-drop/frame_00001.png', 'assets/water-drop/frame_00017.png');
        // drop2 = p5.createSprite(410, 300);
        // drop2.addAnimation('normal', 'assets/water-drop/frame_00001.png', 'assets/water-drop/frame_00017.png');
    }

    const toggleSwitch = () => {
        levelManager.next();
        isDarkMode = !isDarkMode;
        isDarkMode ? room.changeAnimation('dark') : room.changeAnimation('day');
        isDarkMode ? lightSwitch.changeAnimation('dark') : lightSwitch.changeAnimation('day');
    }

    p5.setup = () => {
        p5.rectMode(p5.CENTER);
        levelManager.start();
        window.levelManager = levelManager;
        p5.createCanvas(1280, 720);
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

    p5.mouseMoved = () => {
        levelManager.mouseMoved();
    }

    p5.draw = () => {
        p5.background(isDarkMode ? p5.color(0, 0, 0) : p5.color(255));
        // p5.drawSprite(room);
        // p5.drawSprite(lightSwitch);
        // p5.drawSprite(drop);
        // p5.tint(255, 120);
        // p5.drawSprite(drop2);
        levelManager.draw();
        // p5.drawSprite(river);
        p5.text("X: "+ p5.mouseX, 0, p5.height/4);
        p5.text("Y: "+ p5.mouseY, 0, p5.height/2);
    }

});

export default {
    mouseOverWhichRoomArea: mouseOverWhichRoomArea
};


