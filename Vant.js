export default class Vant {
    // we are drawing sprites on the parent canvas (p5Instance)
    // but pixels are set on context (another graphics layer)
    constructor(p5Instance, x, y, context) {
        this.sprite = p5Instance.createSprite(x, y, 10, 10);
        this.dir = p5Instance.random(0, 360);
        this.context = context;
        this.p5 = p5Instance;
    }

    __checkEdges() {
        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        if (x > this.context.width) {
            this.sprite.position.x = 0;
          } else if (x < 0) {
            this.sprite.position.x = this.context.width;
          }
       
          if (y > this.context.height) {
            this.sprite.position.y = 0;
          } else if (y < 0) {
            this.sprite.position.y = this.context.height;
          }
    }

    __setPixels(x, y, color) {
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 1; j++) {
                this.context.set(x + i, y + j, color);
            }
        }
    }

    __isMyColorOfThisColor(thisColor) {
        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        // let parentX = this.context.contextPos.x - (this.context.width / 2 - x);
        // let parentY = this.context.contextPos.y - (this.context.height / 2 - y);
        let c = this.context.get(x, y);
        // let parentC = this.p5.get(parentX, parentY);
        var thisColor = thisColor || [255, 255, 255];
        // if either has that color, then return s true
        let meIsOfThisColor = c[0] == thisColor[0] && c[1] == thisColor[1] || c[2] == thisColor[2];
        // let parentIsOfThisColor = parentC[0] == thisColor[0] && parentC[1] == thisColor[1] || parentC[2] == thisColor[2];
        return meIsOfThisColor;
    }

    __turn() {
        this.__checkEdges(this.context);

        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        if (!this.__isMyColorOfThisColor()) {
            this.dir += 30;
            //this.context.set(x, y, [255, 255, 255, 255]);
            this.__setPixels(x, y, [255, 255, 255, 255]);
        } else {
            this.dir -=30;
            //this.context.set(x, y, [0, 0, 0, 255]);
            this.__setPixels(x, y, [0, 0, 0, 255]);
        }
    }

    draw() {
        this.sprite.setSpeed(.1, this.dir);
        this.__turn();
    }
} 