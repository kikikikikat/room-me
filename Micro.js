import utils from './utils.js';
export default class Micro {
    constructor(p5Instance, x, y, context, opts) {
        var opts = opts || {};
        this.context = context || p5Instance;
        this.sprite = p5Instance.createSprite(x, y, 30, 30);
        this.sprite.scale = .2;
        let type = p5Instance.random(['a', 'b']);
        //assets/level-biosphere/micro-1/frame_00001.png
        this.sprite.addAnimation('default', `assets/level-biosphere/micro-${type}/frame_00001.png`, `assets/level-biosphere/micro-${type}/frame_00003.png`);

        this.p5 = p5Instance;
        this.center = opts.center;
        this.area = opts.area;
        this.uts = utils(p5Instance);
    }

    __isCloseEnough(threshold, a, b) {
        let aPos = a instanceof p5.Vector ? a : this.p5.createVector(a.position.x, a.position.y);
        let bPos = b instanceof p5.Vector ? b : this.p5.createVector(b.position.x, b.position.y);
        let dist = p5.Vector.dist(aPos, bPos);
        return dist <= threshold;
    }

    draw() {
        //this.sprite.setSpeed(2, this.p5.random(0, 360));
        if (this.center) {
            this.sprite.attractionPoint(.2, this.center.x, this.center.y);
        }

        if (this.__isCloseEnough(this.p5.random(0, 10), this.sprite.position, this.center)) {
            this.sprite.velocity.x = 0;
            this.sprite.velocity.y = 0;
        }
        this.sprite.update();
        this.p5.drawSprites();

    }
}