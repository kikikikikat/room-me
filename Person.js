export default class Person {
    constructor(p5Instance, x, y, context, group, opts) {
        var opts = opts || {};
        this.context = context;
        this.p5 = p5Instance;

        let xOnParentCanvas = this.context.contextPos.x - (this.context.width / 2 - x);
        let yOnParentCanvas = this.context.contextPos.y - (this.context.height / 2 - y);
  
        this.sprite = this.context.createSprite(x, y, 5, 5);
        this.sprite.person = this;
        this.dir = p5Instance.random(0, 360);
        this.group = group;
        this.group.add(this.sprite);

        this.initialSickPercentage = opts.initialSickPercentage || 0.2;
        this.infectiousness = opts.infectiousness || 0.5;
        this.speed = opts.speed || 1;

        this.isSick = (p5Instance.random() < this.initialSickPercentage ) ? true : false;
    }

    __setPixels(x, y, color) {
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 1; j++) {
                this.context.set(x + i, y + j, color);
            }
        }
    }

    __isColliding() {
        this.sprite.collide(this.group, (me, other) => {
            let diceResult;
            if (me.person.isSick && !other.person.isSick) {
                diceResult = this.p5.random() < this.infectiousness;
                if (diceResult) {
                    other.person.isSick = true;
                }
            } else if (!me.person.isSick && other.person.isSick) {
                diceResult = this.p5.random() < this.infectiousness;
                if (diceResult) {
                    me.person.isSick = true;
                }               
            }
        })
    }

    draw() {
        this.dir += this.context.random(0, 360);
        //this.dir -= this.context.random(0, 360);
        this.sprite.setSpeed(this.speed, this.dir);
        this.sprite.update();

        this.__isColliding();

        this.sprite.shapeColor = this.isSick ? [255, 0, 0, 255] : [0, 0, 0, 255];
        this.context.drawSprites();
    }
}