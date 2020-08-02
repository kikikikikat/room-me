import Level from './Level.js';
import LevelManager from './LevelManager.js';
import utils from './utils.js';


import levelWindows from './level-0-windows.js';
import levelStairs from './level-0-stairs.js';

import level_1 from './level-1-opening-room.js';
import level_2 from './level-2-text.js';
import level_3 from './level-3-swim.js';
import level_eye from './level-0-eye.js';
import level_trapped from './level-0-trapped.js';
import level_text_live_close from './level-0-text-live-close.js';
import level_text_watch from './level-0-text-watch.js';
import level_text_explore from './level-0-text-explore.js';
import level_text_over from './level-0-text-over-over.js';

import level_text_others from './level-0-text-others.js';
import level_text_ending from './level-0-text-ending.js';
import level_friend from './level-0-friend.js';
import level_unimaginable from './level-0-unimaginable.js';
import level_text_unimaginable from './level-0-text-unimaginable.js';

var levelData = [  
    level_1,
    level_2,
    level_friend,
    level_text_live_close,
    level_trapped,
    level_text_watch,
    level_eye,
    level_text_explore,
    levelStairs,
    level_text_over,
    level_3,
    level_text_unimaginable,
    level_unimaginable,
    level_text_others,
    levelWindows,
    level_text_ending
];
  

new p5(p5Instance => {
    let uts = utils(p5Instance);
    const levels = [];

    for (let i = 0; i < levelData.length; i++) {

        let level = new Level(i, levelData[i] && levelData[i](p5Instance));
        levels.push(level);
    }

    const levelManager = new LevelManager(levels);


    let fontRegular, fontBold;

    let button;
    p5Instance.preload = () => {

        fontRegular = p5Instance.loadFont('assets/fonts/AmaticSC-Regular.ttf');
        fontBold = p5Instance.loadFont('assets/fonts/AmaticSC-Bold.ttf');
    }


    p5Instance.setup = () => {
        p5Instance.rectMode(p5Instance.CENTER);
        p5Instance.createCanvas(p5Instance.windowWidth, p5Instance.windowHeight);

        levelManager.start();
        window.levelManager = levelManager;

        button = p5Instance.createButton('-> next');
        button.addClass('nextButton');
        button.position(p5Instance.width / 2 - 40, p5Instance.height * .86);
        button.mousePressed(()=> {
            levelManager.next();
        });

        p5Instance.textFont(fontRegular);
        p5Instance.textSize(34);
    };

    p5Instance.mouseMoved = () => {
        levelManager.mouseMoved();
    }

    p5Instance.mouseClicked = () => {
        levelManager.mouseClicked();
    }

    p5Instance.windowResized = () => {
        p5Instance.resizeCanvas(p5Instance.windowWidth, p5Instance.windowHeight);
      }


    p5Instance.draw = () => {
        p5Instance.background(255);
        levelManager.draw();
        if (levelManager.getCurrentLevel().index === levelData.length - 1) {
            button.addClass('hide');
        }

    }

});

export default {

};


