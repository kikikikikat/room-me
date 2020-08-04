(function () {
    'use strict';

    class Level {

        constructor(index, levelData) {
            this.index = index;
            this.levelData = levelData;
            this.destroyedStatus = false;
        }

        start() {
            this.levelData.start();
        }

        mouseMoved() {
            if (this.levelData.mouseMoved) {
                this.levelData.mouseMoved();
            }
        }

        mouseClicked() {
            if (this.levelData.mouseClicked) {
                this.levelData.mouseClicked();
            }
        }

        destroy() {
            this.destroyedStatus = true;
            this.cleanup();
        }

        cleanup() {
            this.levelData.cleanup();
        }

        isDestroyed() {
            return this.destroyedStatus;
        }

        draw() {
            if (this.destroyedStatus) return;
            this.levelData.draw();
        }
    }

    class LevelManager {

        constructor(levels) {
            this.levels = levels;
            this.currentLevel = null;
        }

        next(noLevelLeftCallback) {
            if (this.currentLevel) {
                this.currentLevel.destroy();
                this.currentLevel = null;
            }
            if (this.levels.length > 0) {
                this.currentLevel = this.levels.shift();
                this.currentLevel.start(0, 0, 1280, 720);
            } else {
                if (typeof noLevelLeftCallback === 'function') {
                    noLevelLeftCallback();
                }
            }
        }

        start() {
            this.next();
        }

        draw() {
            // if (this.currentLevel && this.currentLevel.isDestroyed()) {
            //     this.__startNextLevel();
            // } else {
            //     this.currentLevel.draw();
            // }
            if (this.currentLevel) {
                if (this.currentLevel.isDestroyed()) {
                    this.next();
                } else {
                    this.currentLevel.draw();
                }
            }
        }

        mouseMoved() {
            if (this.currentLevel) {
                if (this.currentLevel.isDestroyed()) {
                    this.next();
                } else {
                    this.currentLevel.mouseMoved();
                }
            }
        }

        mouseClicked() {
            if (this.currentLevel) {
                if (this.currentLevel.isDestroyed()) {
                    this.next();
                } else {
                    this.currentLevel.mouseClicked();
                }
            }
        }

        getCurrentLevel() {
            return this.currentLevel;
        }
    }

    var utils = (p5Instance) => {

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

        const intersect_point = (point1, point2, point3, point4) => {
            const ua = ((point4[0] - point3[0]) * (point1[1] - point3[1]) - 
                    (point4[1] - point3[1]) * (point1[0] - point3[0])) /
                    ((point4[1] - point3[1]) * (point2[0] - point1[0]) - 
                    (point4[0] - point3[0]) * (point2[1] - point1[1]));
        
            const ub = ((point2[0] - point1[0]) * (point1[1] - point3[1]) - 
                        (point2[1] - point1[1]) * (point1[0] - point3[0])) /
                        ((point4[1] - point3[1]) * (point2[0] - point1[0]) - 
                        (point4[0] - point3[0]) * (point2[1] - point1[1]));
            
            const x = point1[0] + ua * (point2[0] - point1[0]);
            const y = point1[1] + ua * (point2[1] - point1[1]);
            
            return [x, y]
        };

        const handDraw = (context, p1, p2, opts) => {
            p5Instance.randomSeed(p5Instance.frameCount * p1.x * p1.y);
            var opts = opts || {};
            
            let offset = opts.offset || 2;
            context.strokeWeight(opts.strokeWeight || 1);
            if (opts.color) {
                context.stroke(opts.color[0], opts.color[1], opts.color[2], 255);
            }

            let points = [];
            let dist = p5.Vector.sub(p2, p1).mag();
            for (let i = 0; i < dist; i+=20) {
                let dir = p5.Vector.sub(p2, p1).normalize();            let rotateNoise = p5Instance.map(p5Instance.noise(p5Instance.random()), 0, 1, -p5Instance.radians(.5), p5Instance.radians(.5));
                let adjustedDir = dir.rotate(rotateNoise);
                let p = p5.Vector.add(p1, p5.Vector.mult(adjustedDir, i));
                
                let noise = p5Instance.noise(i + p5Instance.random(1000));
                let noise2 = p5Instance.noise(i + p5Instance.random(1000));
                
                p.x = p5Instance.map(noise, 0, 1, p.x - offset, p.x + offset);
                p.y = p5Instance.map(noise2, 0, 1, p.y - offset, p.y + offset);
                points.push(p);
            }

            points.push(p2);

            for (let i = 0; i < points.length; i++) {
                let p = points[i];
                if (i != points.length - 1) {
                    context.line(p.x, p.y, points[i+1].x, points[i + 1].y);
                }
            }
        };

        const drawHorizontalArea = (context, leftTop, leftBottom, rightTop, rightBottom, sep, opts) => {
            let h = leftBottom.y - leftTop.y;
            for (let y = 0; y < h; y += sep) {
                let leftP = intersect_point([0, leftTop.y + y], [context.width, leftTop.y + y], [leftTop.x, leftTop.y], [leftBottom.x, leftBottom.y]);
                let rightP = intersect_point([0, rightTop.y + y], [context.width, rightTop.y + y], [rightTop.x, rightTop.y], [rightBottom.x, rightBottom.y]);
                handDraw(context, p5Instance.createVector(leftP[0], leftP[1]), p5Instance.createVector(rightP[0], rightP[1]), opts);
            }
        };

        const drawVerticalArea = (context, leftTop, leftBottom, rightTop, rightBottom, sep, opts) => {
            var opts = opts || {};
            let w = rightTop.x - leftTop.x;
            let xStart = opts.xStart || 0;
            for (let x = xStart; x < w; x += sep) {
                let topP = intersect_point([leftTop.x + x, 0], [leftTop.x + x, context.height], [leftTop.x, leftTop.y], [rightTop.x, rightTop.y]);
                let bottomP = intersect_point([leftBottom.x + x, 0], [leftBottom.x + x, context.height], [leftBottom.x, leftBottom.y], [rightBottom.x, rightBottom.y]);
                handDraw(context, p5Instance.createVector(topP[0], topP[1]), p5Instance.createVector(bottomP[0], bottomP[1]), opts);
            }
        };

        const drawRecHorizontal = (context, origin, w, h, sep, opts) => {
            let leftTop = origin;
            let leftBottom = p5Instance.createVector(origin.x, origin.y + h);
            let rightTop = p5Instance.createVector(origin.x + w, origin.y);
            let rightBottom = p5Instance.createVector(origin.x + w, origin.y + h);
            drawHorizontalArea(context, leftTop, leftBottom, rightTop, rightBottom, sep, opts);
        };

        const drawRecVertical = (context, origin, w, h, sep, opts) => {
            let leftTop = origin;
            let leftBottom = p5Instance.createVector(origin.x, origin.y + h);
            let rightTop = p5Instance.createVector(origin.x + w, origin.y);
            let rightBottom = p5Instance.createVector(origin.x + w, origin.y + h);
            drawVerticalArea(context, leftTop, leftBottom, rightTop, rightBottom, sep, opts);
        };

        const drawRec = (context, leftTop, rightBottom) => {
            let leftBottom = p5Instance.createVector(leftTop.x, rightBottom.y);
            let rightTop = p5Instance.createVector(rightBottom.x, leftTop.y);

            handDraw(context, leftTop, rightTop);
            handDraw(context, rightTop, rightBottom);
            handDraw(context, leftTop, leftBottom);
            handDraw(context, leftBottom, rightBottom);
        };

        const drawRoom = (context, leftTop, rightBottom) => {
            let screenLeftTop = p5Instance.createVector(0, 0),
                screenLeftBottom = p5Instance.createVector(0, context.height),
                screenRightTop = p5Instance.createVector(context.width, 0),
                screenRightBottom = p5Instance.createVector(context.width, context.height);

            let leftBottom = p5Instance.createVector(leftTop.x, rightBottom.y);
            let rightTop = p5Instance.createVector(rightBottom.x, leftTop.y);


            drawRec(context, leftTop, rightBottom);

            handDraw(context, screenLeftTop, leftTop);
            handDraw(context, screenRightTop, rightTop);
            handDraw(context, screenLeftBottom, leftBottom);
            handDraw(context, screenRightBottom, rightBottom);
        };

        const drawRadiantLines = (context, x, y, numOfLines, radius, lineLength, opts, radians) => {
            //draw a line perpendicular to a circle that has the length of the steps done each day.
            for (let i = 0; i < numOfLines; i++) {
                let angle = p5Instance.map(i,0,numOfLines,0, radians || p5Instance.TWO_PI);//equally spacing lines along the circle.
                 //radius = the internal cycle.
                let distortion = opts.distortion || 0;
                let start = opts.start || 0;
                let x1 = (x || 0) + radius * p5Instance.cos(angle + start);
                let y1 = (y || 0) + radius * p5Instance.sin(angle + start);
                let x2 = (x || 0) + (radius + lineLength) * p5Instance.cos(angle + distortion + start);
                let y2 = (y || 0) + (radius+lineLength) * p5Instance.sin(angle + distortion + start);
                //context.line(x1,y1,x2,y2);
                handDraw(context, p5Instance.createVector(x1, y1), p5Instance.createVector(x2, y2), opts);
            }

        };

        const isCloseEnough = (threshold, a, b) => {
            let aPos = a instanceof p5.Vector ? a : undefined.p5.createVector(a.position.x, a.position.y);
            let bPos = b instanceof p5.Vector ? b : undefined.p5.createVector(b.position.x, b.position.y);
            let dist = p5.Vector.dist(aPos, bPos);
            return dist <= threshold;
        };

        return {
            getColor,
            isCloseEnough,
            handDraw,
            drawHorizontalArea,
            drawRecHorizontal,
            drawRecVertical,
            drawVerticalArea,
            drawRadiantLines,
            drawRoom,
            drawRec
        }

    };

    var levelWindows = p5Instance => {

        let pg, windows, area, hand, handAnimation, smokeAnimation, smoke, birdAnimation, bird, uts = utils(p5Instance);
        let offsetX, offsetY, scaleFactor;

        const start = () => {
            scaleFactor = 0.5;
            pg = p5Instance.createGraphics(640, 420);
            windows = p5Instance.createSprite(320, 180); // put sprite at (0, 0)
            windows.addAnimation('default', `assets/level-windows/frame_00001.png`, `assets/level-windows/frame_00002.png`);
            windows.scale = scaleFactor;
        
            smokeAnimation = p5Instance.loadAnimation('assets/level-windows/smoke/frame_00001.png', 'assets/level-windows/smoke/frame_00010.png');
            smokeAnimation.looping = false;


            birdAnimation = p5Instance.loadAnimation('assets/level-windows/bird/frame_00001.png', 'assets/level-windows/bird/frame_00011.png');
            birdAnimation.looping = false;

            handAnimation = p5Instance.loadAnimation('assets/level-windows/hand/frame_00001.png', 'assets/level-windows/hand/frame_00013.png');
            handAnimation.looping = false;

            area = p5Instance.loadImage('assets/level-windows/area.png');
            area.resize(640, 360);
            offsetX = 180;
            offsetY = 90;
        };


        const drawSmoke = (x, y) => {
            smoke = p5Instance.createSprite(x, y);
            smoke.addAnimation('default', smokeAnimation);
            smoke.scale = 0.5;
        };

        const drawBird = (x, y) => {
            bird = p5Instance.createSprite(x, y);
            bird.addAnimation('default', birdAnimation);
            bird.scale = 0.3;
        };

        const drawHand = (x, y) => {
            hand = p5Instance.createSprite(x, y);
            hand.addAnimation('default', handAnimation);
            hand.scale = 0.4;
        };

        const mouseMoved = () => {
            let color = uts.getColor(area, p5Instance.mouseX - offsetX, p5Instance.mouseY - offsetY);
            if (color == 'red') {
                p5Instance.cursor(p5Instance.HAND);
            } else {
                p5Instance.cursor(p5Instance.DEFAULT);
            }
        };

        const mouseClicked = () => {
            let color = uts.getColor(area, p5Instance.mouseX - offsetX, p5Instance.mouseY - offsetY);
            //if (!color) return;
            // then clicking on the window
            if (color == 'red') {
                if (p5Instance.mouseX > 500) {
                    drawHand(p5Instance.mouseX - 190, p5Instance.mouseY - 100);
                } else {
                    if (p5Instance.random() < 0.5) {
                        drawSmoke(p5Instance.mouseX - 150, p5Instance.mouseY - 100);
                    } else {
                        drawBird(p5Instance.mouseX - 50, p5Instance.mouseY - 100);
                    }
                }
            }
        };

        const draw = () => {
            p5Instance.background(250);
            p5Instance.push();
            p5Instance.translate(offsetX, offsetY);
            p5Instance.drawSprite(windows);
            p5Instance.drawSprite(smoke);
            p5Instance.drawSprite(bird);
            p5Instance.drawSprite(hand);

            // p5Instance.image(area, 0, 0);

            area.resize(640, 360);
            p5Instance.pop();

        };


        const cleanup = () => {
            console.log('clean up river');
            // p5.removeSprite(river);
        };


        return {
            start,
            draw,
            mouseMoved,
            mouseClicked,
            cleanup
        }

    };

    var levelStairs = p5Instance => {

        let pg, linesPg, stairs;
        let scaleFactor;

        let walker;

        const start = () => {
            scaleFactor = .7;
            pg = p5Instance.createGraphics(640, 420);
            linesPg = p5Instance.createGraphics(200, 200);
            stairs = p5Instance.createSprite(p5Instance.windowWidth / 2, 320); // put sprite at (0, 0)
            stairs.addAnimation('default', `assets/level-stairs/frame_00001.png`, `assets/level-stairs/frame_00002.png`);
            stairs.scale = scaleFactor;

            walker = p5Instance.createSprite(p5Instance.windowWidth / 2 - 10, 340);
            walker.addImage('static', p5Instance.loadImage('assets/level-stairs/spider-static/frame_00001.png'));
            walker.addAnimation('walking', 'assets/level-stairs/spider-walking/frame_00001.png', 'assets/level-stairs/spider-walking/frame_00004.png');
            walker.addImage('invisible',  p5Instance.loadImage('assets/level-stairs/spider-invisible/frame_00005.png'));
            walker.scale = 0.33;
        };

        p5Instance.mousePressed = () => {
            // drawFlowers();
        };

        let wayPoints = [
            {
                pos: p5Instance.createVector(p5Instance.windowWidth / 2 + 20, 200),
            },
            {
                pos: p5Instance.createVector(p5Instance.windowWidth / 2 - 10, 180),
                shouldHide: true
            },
            {
                pos: p5Instance.createVector(p5Instance.windowWidth / 2 - 40, 440)
            }
        ];

        const isCloseEnough = (threshold, a, b) => {
            let aPos = a instanceof p5.Vector ? a : p5Instance.createVector(a.position.x, a.position.y);
            let bPos = b instanceof p5.Vector ? b : p5Instance.createVector(b.position.x, b.position.y);
            let dist = p5.Vector.dist(aPos, bPos);
            return dist <= threshold;
        };

        let isMovingToWP = false;
        let currentDestWP = null;
        let shouldHide = false;
        const followWayPoints = (person) => {
            if (p5Instance.mouseIsPressed) {
                console.log('pressed');
                if (wayPoints.length > 0 && !isMovingToWP) {
                    currentDestWP = wayPoints.shift();
                    console.log('new wp', currentDestWP);
                    person.attractionPoint(.8, currentDestWP.pos.x, currentDestWP.pos.y);
                    isMovingToWP = true;
                    walker.changeAnimation('walking');
                }
            }
        };

        const stopWayPoints = (person) => {

            if (isMovingToWP && currentDestWP && isCloseEnough(10, person, currentDestWP.pos)) {
                console.log('close to wp?');
                person.velocity.x = 0;
                person.velocity.y = 0;
                isMovingToWP = false;

                if (currentDestWP.shouldHide) {
                    walker.rotationSpeed = 0.02;
                    walker.rotation = -90;
                    setTimeout(() => {
                        shouldHide = true;
                    }, 200);
                } else {
                    shouldHide = false;
                }
                currentDestWP = null;
                walker.changeImage('static');
            }
        };

        const draw = () => {
            pg.background(255, 255, 255);
            let pgX = p5Instance.windowWidth / 2 - pg.width / 2;
            let pgY = p5Instance.windowHeight / 2 - pg.height / 2;
            p5Instance.image(pg, pgX, pgY);

            p5Instance.drawSprite(stairs);

            // uts.drawVerticalArea(
            //     p5Instance,
            //     p5Instance.createVector(p5Instance.windowWidth / 2 - 100, 335),
            //     p5Instance.createVector(p5Instance.windowWidth / 2, 496),
            //     p5Instance.createVector(477, 358),
            //     p5Instance.createVector(478, 518),
            //     4
            // )

            followWayPoints(walker);
            stopWayPoints(walker);

            if (shouldHide) {
                walker.changeImage('invisible');
            }

            p5Instance.drawSprite(walker);
        };


        const cleanup = () => {
            console.log('clean up river');
            // p5.removeSprite(river);
        };


        return {
            start,
            draw,
            // mouseMoved,
            cleanup
        }

    };

    var level_1 = p5Instance => {

        let uts = utils(p5Instance);

        let lightSwitch;
        let isDarkMode = false;

        const roomWPerc = 0.35;
        const roomHPerc = 0.4;

        const text = 'Room/me';


        const drawCentralRoom = (wPerc, hPerc) => {
            let roomWidth = p5Instance.width * wPerc;
            let roomHeight = p5Instance.height * hPerc;
            let roomLeftTop = p5Instance.createVector((p5Instance.width - roomWidth) / 2, (p5Instance.height - roomHeight) / 2);
            let roomRightBottom = p5Instance.createVector((p5Instance.width + roomWidth) / 2, (p5Instance.height + roomHeight) / 2);
            uts.drawRoom(p5Instance, roomLeftTop, roomRightBottom);
        };

        const toggleSwitch = () => {
            isDarkMode = !isDarkMode;
            isDarkMode ? lightSwitch.changeAnimation('dark') : lightSwitch.changeAnimation('light');
        };

        const start = () => {
            lightSwitch = p5Instance.createSprite(170, 320);
            lightSwitch.scale = .4;
            lightSwitch.addAnimation('light', 'assets/switch/frame_1.png', 'assets/switch/frame_4.png');
            lightSwitch.addAnimation('dark', 'assets/switch-pressed/frame_1.png', 'assets/switch-pressed/frame_2.png');
            lightSwitch.setCollider('circle', 0, 0, 100);
            lightSwitch.onMouseOver = () => {
                p5Instance.cursor('pointer');
            };
            lightSwitch.onMouseOut = () => {
                p5Instance.cursor('default');
            };
            lightSwitch.onMouseReleased = () => {
                console.log('switch pressed');
                toggleSwitch();
            };

        };

        p5Instance.mouseClicked = () => {
            console.log('mouse pressed');

        };

        const draw = () => {
            p5Instance.background(isDarkMode ? 20 : 240);
            p5Instance.stroke(isDarkMode ? 240 : 20);
            drawCentralRoom(roomWPerc, roomHPerc);
            p5Instance.drawSprite(lightSwitch);

            {
                p5Instance.textAlign(p5Instance.CENTER);
                p5Instance.fill(128 + p5Instance.sin(p5Instance.frameCount*0.01) * 128);
                p5Instance.textSize(50);
                p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            }
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_2 = p5Instance => {

        const text = 'the room and i kind of became best friends after spending so much time together.';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_3 = p5Instance => {
        let uts = utils(p5Instance);
        let swimAnimation;

        let swimmers = [];


        const start = () => {
            swimAnimation = p5Instance.loadAnimation('assets/level-swim/swimmer/frame_00001.png', 'assets/level-swim/swimmer/frame_00012.png');

            for (let i = 0; i < 10; i++) {
                let x = p5Instance.random(100, p5Instance.width - 100);
                let y = p5Instance.random(100, p5Instance.height - 100);
                swimmers.push(createSwimmer(x, y));
            }



        };

        const createSwimmer = (x, y) => {
            let sprite = p5Instance.createSprite(x || p5Instance.width / 2, y || p5Instance.height / 2);
            sprite.addAnimation('swimming', swimAnimation);
            sprite.velocity.y = p5Instance.random(-1, -0.1);
            sprite.scale = p5Instance.random(0.05, .8);
            return sprite;
        };

        const drawSwimming = (swimmer) => {

            p5Instance.push();
            // p5Instance.rotate(stepDir());
            p5Instance.fill(60);

            swimmer.rotation = 0;
            if (swimmer.position.x > p5Instance.width) {
                swimmer.position.x = 10;
            } else if (swimmer.position.x < 0) {
                swimmer.position.x = p5Instance.width - 10;
            }
            if (swimmer.position.y > p5Instance.height) {
                swimmer.position.y = 0;
            } else if (swimmer.position.y < 0) {
                swimmer.position.y = p5Instance.height - 10;
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
        };




        const draw = () => {
            p5Instance.background( 240);
            p5Instance.stroke( 20);

            swimmers.forEach(s => {
                drawSwimming(s);
            });
     
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_eye = p5Instance => {
        let uts = utils(p5Instance);

        let eyes = [], eyeImage;

        let pg3D;

        const start = () => {
            let eyePositions = [];
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    eyePositions.push(
                        p5Instance.createVector(
                            p5Instance.width / 2 + x * 120,
                            p5Instance.height / 2 + y * 100
                        )
                    );           
                }
            }
            eyeImage = p5Instance.loadImage('assets/level-eye/eye-socket.png');
            for (let i = 0; i < 9; i++) {
                eyes.push(createEye(eyePositions[i].x, eyePositions[i].y));
            }
            pg3D = p5Instance.createGraphics(700, 700, p5Instance.WEBGL);
        };

        const createEye = (x, y) => {
            let sprite = p5Instance.createSprite(x || p5Instance.width / 2, y || p5Instance.height / 2);
            sprite.addImage(eyeImage);
            sprite.scale = .2;
            return sprite;
        };

        const getEyeballPos = (x, y, radius) => {
            let ro = 7;
            let dist = p5Instance.dist(p5Instance.mouseX, p5Instance.mouseY, x, y); 
            let si1 = (p5Instance.mouseX-x)/dist; 
            let co1 = (p5Instance.mouseY-y)/dist;
            let ox, oy;
            if(p5Instance.abs(dist) < radius){ 
              ox = p5Instance.mouseX; 
              oy = p5Instance.mouseY; 
            }
            else { 
              ox = x+ro*si1; 
              oy = y+ro*co1; 
            }
            return p5Instance.createVector(ox, oy);
        };

        const drawEyeball = (x, y) => {
            // three levels
            // for (let i = 0; i < 3; i++) {
            //     let density = p5Instance.random(10, 40) * i;
            //     let innerRad = p5Instance.random(10, 30) * (3 - i);
            //     let length = p5Instance.random(5, 20);
            //     let offset = 0;
            //     let start;
            //     uts.drawRadiantLines(p5Instance, x, y, density, innerRad, length, {
            //         offset: offset
            //     });           
            // }

            uts.drawRadiantLines(p5Instance, x, y, 30, 10, 5, {
                distortion: 0,
                offset: 10
            });

            uts.drawRadiantLines(p5Instance, x, y, 30, 2, 5, {distortion: 30}, p5Instance.TWO_PI * 0.9);
         
            // uts.drawRadiantLines(p5Instance, x, y, 10, 5, 20, { start : 60, distortion: 60 }, p5Instance.TWO_PI * 0.4);
        };

        const draw = () => {
            p5Instance.background( 240);
            p5Instance.stroke( 20);

            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    p5Instance.push();
                    let eyeBallPos = getEyeballPos(p5Instance.width / 2 + x * 120, p5Instance.height / 2 + y * 100, 20);
                    drawEyeball(eyeBallPos.x, eyeBallPos.y);
                    p5Instance.pop();               
                }
            }

            eyes.forEach(e => {
                p5Instance.drawSprite(e);
            });

            p5Instance.imageMode(p5Instance.CENTER);
            p5Instance.image(pg3D, p5Instance.width / 2, p5Instance.height / 2);
            //pg3D.background(255, 30, 30, 30);
            pg3D.noFill();
            // pg3D.perspective(.8);
            // pg3D.rotateX(p5Instance.frameCount * 0.001);
            // pg3D.rotateY(p5Instance.frameCount * 0.001);
            pg3D.box(480, 480, 260);

     
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_trapped = p5Instance => {
        let uts = utils(p5Instance);

        let mask, masked;

        let nx, ny, nz = 0;


        const start = () => {
            mask = p5Instance.loadImage('assets/level-trapped/frame_00002.png');
            masked = p5Instance.createGraphics(200, 200);
        };

        const drawNoisy = (context) => {
            let size = 10;
            p5Instance.noFill();
            for (let i = 0; i < 1000; i++) {
                let firstPoint = [
                    p5Instance.random(0, context.width),
                    p5Instance.random(0, context.height)
                ];
                context.triangle(
                    firstPoint[0],
                    firstPoint[1],
                    firstPoint[0] + p5Instance.random(-size, size),
                    firstPoint[1] + p5Instance.random(-size, size),
                    firstPoint[0] + p5Instance.random(-size, size),
                    firstPoint[1] + p5Instance.random(-size, size),
                );
            }
        };

        const drawStream = () => {
            let offset = 50;
            let size = 50;
            let paddingFactor = .3;
            nx = 0;
            for (let i= p5Instance.width * paddingFactor; i < p5Instance.width - p5Instance.width * paddingFactor; i += 45) {
              ny = 0;
              for (let j=p5Instance.height * paddingFactor; j<p5Instance.height - p5Instance.height * paddingFactor; j += 45) {
                let angle = p5Instance.map (p5Instance.noise (nx, ny, nz), 0, 3, 0, p5Instance.PI*5);
                let x = size * p5Instance.cos (angle);
                let y = size * p5Instance.sin (angle);
                uts.handDraw(
                    p5Instance,
                    p5Instance.createVector(i, j),
                    p5Instance.createVector(i + x, j + y)
                );

                uts.handDraw(
                    p5Instance,
                    p5Instance.createVector(i+offset+x, j+y),
                    p5Instance.createVector(i + offset, j)
                );
                uts.handDraw(
                    p5Instance,
                    p5Instance.createVector(i, j),
                    p5Instance.createVector(i + offset, j)
                );

                uts.handDraw(
                    p5Instance,
                    p5Instance.createVector(i + x, j + y),
                    p5Instance.createVector(i+offset+x, j+y)
                );
                
                ny += 0.03;
              }
              nx += 0.02;
            }
            nz +=0.01;
          };





        const draw = () => {
            p5Instance.background( 240);
            p5Instance.stroke( 20);

            
            //masked.background(255 * (p5Instance.cos(p5Instance.frameCount * 0.1)), 0, 0);
            drawNoisy(masked);

            let maskedR = masked._renderer.get();
            maskedR.mask(mask);
            p5Instance.push();
            p5Instance.translate(p5Instance.width / 2, p5Instance.height / 2);
            p5Instance.rotate(p5Instance.PI / 180 * 45);
            p5Instance.rotate(p5Instance.map(p5Instance.mouseX, 0, p5Instance.width, 0, p5Instance.TWO_PI));
            p5Instance.imageMode(p5Instance.CENTER);
            p5Instance.image(maskedR, 0, 0);
            p5Instance.pop();

            masked.clear();

            drawStream();


     
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_text_live_close = p5Instance => {

        const text = 'at first we just lived close to each other.';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_text_watch = p5Instance => {

        const text = 'we watch each other...';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_text_explore = p5Instance => {

        const text = 'we explore each other...';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_text_over = p5Instance => {

        const text = 'over and over...';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_text_others = p5Instance => {

        const text = 'sometimes we wonder how other room-people are doing.';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_text_ending = p5Instance => {

        const text = 'every one has a way to be their own perfect roommate.';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_friend = p5Instance => {

        let mask, masked;

        let pg3D;

        let desk, chair, windows;


        const start = () => {
            mask = p5Instance.loadImage('assets/level-friend/frame_00001.png');
            masked = p5Instance.createGraphics(1280, 720);

            pg3D = p5Instance.createGraphics(252, 122, p5Instance.WEBGL);

            desk = p5Instance.createSprite(450, 360);
            desk.scale = .5;
            desk.addAnimation('default', 'assets/desk/frame_00001.png', 'assets/desk/frame_00002.png');

            chair = p5Instance.createSprite(650, 370);
            chair.scale = .5;
            chair.addAnimation('default', 'assets/chair/frame_00001.png', 'assets/chair/frame_00002.png');

            chair = p5Instance.createSprite(550, 370);
            chair.scale = .5;
            chair.addAnimation('default', 'assets/chair/frame_00001.png', 'assets/chair/frame_00002.png');

            windows = p5Instance.createSprite(650, 280);
            windows.scale = .6;
            windows.addAnimation('default', 'assets/windows/frame_00001.png', 'assets/windows/frame_00002.png');
        };

        const drawNoisy = (context) => {
            let size = 40;
            context.fill(0);
            for (let i = 0; i < 1000; i++) {
                let firstPoint = [
                    p5Instance.random(0, context.width),
                    p5Instance.random(0, context.height)
                ];
                context.triangle(
                    firstPoint[0],
                    firstPoint[1],
                    firstPoint[0] + p5Instance.random(-size, size),
                    firstPoint[1] + p5Instance.random(-size, size),
                    firstPoint[0] + p5Instance.random(-size, size),
                    firstPoint[1] + p5Instance.random(-size, size),
                );
            }
        };



        const draw = () => {
            p5Instance.background( 240);
            p5Instance.stroke( 20);

            
            //masked.background(255 * (p5Instance.cos(p5Instance.frameCount * 0.1)), 0, 0);
            drawNoisy(masked);

            let maskedR = masked._renderer.get();
            maskedR.mask(mask);
            p5Instance.push();
            p5Instance.translate(p5Instance.width / 2, p5Instance.height / 2);
            p5Instance.imageMode(p5Instance.CENTER);
            p5Instance.image(maskedR, 0, 0);
            p5Instance.pop();

            masked.clear();

            p5Instance.imageMode(p5Instance.CENTER);
            p5Instance.image(pg3D, p5Instance.width / 2, p5Instance.height / 2 + 40);
            pg3D.background(255, 255, 255, 0);
            pg3D.noFill();
            // pg3D.perspective(.8);
            // pg3D.rotateX(p5Instance.frameCount * 0.001);
            // pg3D.rotateY(p5Instance.frameCount * 0.001);
            pg3D.box(250, 120, 160);

            pg3D.drawSprite(desk);
            pg3D.drawSprite(chair);
            pg3D.drawSprite(windows);

     
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_unimaginable = p5Instance => {

        let uts = utils(p5Instance);

        let plant, plantAnimation;

        let dropAnimation, drops = [];




        const start = () => {
            plantAnimation = p5Instance.loadAnimation('assets/level-unimaginable/plant/frame_00001.png', 'assets/level-unimaginable/plant/frame_00020.png');
            plantAnimation.looping = false;

            dropAnimation = p5Instance.loadAnimation('assets/water-drop/frame_00001.png', 'assets/water-drop/frame_00017.png');

            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < (y + 1); x++)
                drops.push(
                    p5Instance.createSprite((100 - y * 15) + x * 30, 200 + y * 40)
                );
            }
            drops.forEach(d => d.addAnimation('default', dropAnimation));
        };


        const drawPlant = (x, y) => {
            plant = p5Instance.createSprite(x, y);
            plant.addAnimation('default', plantAnimation);
            plant.scale = p5Instance.random(0.3, 0.5);
            plant.rotation = p5Instance.random(-30, 30);
        };

        const drawPlantsRandomly = () => {

            let x = p5Instance.random(50, 100);
            let y = -100;
            drawPlant(x, y);  

        };

        const draw = () => {
            p5Instance.background( 240);
            p5Instance.stroke( 20);

            p5Instance.push();
            p5Instance.translate(p5Instance.width / 2 - 100, p5Instance.height / 2 + 100);
            p5Instance.scale(.8);

            uts.drawVerticalArea(
                p5Instance,
                p5Instance.createVector(0, 0),
                p5Instance.createVector(50, 71),
                p5Instance.createVector(100, 0),
                p5Instance.createVector(150, 71), 
                6,
                {
     
                }
            );

            uts.drawVerticalArea(
                p5Instance,
                p5Instance.createVector(50, -71),
                p5Instance.createVector(0, 0),
                p5Instance.createVector(150, -71),
                p5Instance.createVector(100, 0),
                6
            );

            uts.drawVerticalArea(
                p5Instance,
                p5Instance.createVector(150, -71),
                p5Instance.createVector(100, 0),
                p5Instance.createVector(200, 0),
                p5Instance.createVector(150, 71),
                4
            );

            uts.drawVerticalArea(
                p5Instance,
                p5Instance.createVector(0, 0),
                p5Instance.createVector(-50, 71),
                p5Instance.createVector(50, 71),
                p5Instance.createVector(0, 144),
                4
            );

            uts.drawVerticalArea(
                p5Instance,
                p5Instance.createVector(50, 71),
                p5Instance.createVector(0, 144),
                p5Instance.createVector(150, 71), 
                p5Instance.createVector(100, 144),
                6
            );

            p5Instance.scale(1);

            if (p5Instance.random() < 0.01) {
                drawPlantsRandomly();
            }
            p5Instance.drawSprite(plant);

            p5Instance.pop();

            p5Instance.push();
            p5Instance.translate(p5Instance.width / 2 - 100, -100);
            drops.forEach((d, i) => {
                p5Instance.tint(255, 100 + 40 * i);
                p5Instance.drawSprite(d);
            });

            p5Instance.pop();

        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

    var level_text_unimaginable = p5Instance => {

        const text = 'and we grow.';




        const start = () => {


        };



        const draw = () => {
            p5Instance.background( 20 );
            p5Instance.stroke( 240 );

     
            p5Instance.textAlign(p5Instance.CENTER);
            p5Instance.fill(250);
            p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
            
        };


        const cleanup = () => {

        };


        return {
            start,
            draw,
            cleanup
        }

    };

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
        };


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
        };

        p5Instance.mouseClicked = () => {
            levelManager.mouseClicked();
        };

        p5Instance.windowResized = () => {
            p5Instance.resizeCanvas(p5Instance.windowWidth, p5Instance.windowHeight);
          };


        p5Instance.draw = () => {
            p5Instance.background(255);
            levelManager.draw();
            if (levelManager.getCurrentLevel().index === levelData.length - 1) {
                button.addClass('hide');
            }

        };

    });

    var main = {

    };

    return main;

}());
