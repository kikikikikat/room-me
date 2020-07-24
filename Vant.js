export default class Vant {
    // we are drawing sprites on the parent canvas (p5Instance)
    // but pixels are set on context (another graphics layer)
    constructor(p5Instance, x, y, context) {
        this.sprite = p5Instance.createSprite(x, y, 10, 10);
        this.dir = p5Instance.random(0, 360);
    }

    __checkEdges(context) {
        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        if (x > context.width) {
            this.sprite.position.x = 0;
          } else if (x < 0) {
            this.sprite.position.x = context.width;
          }
       
          if (y > context.height) {
            this.sprite.position.y = 0;
          } else if (y < 0) {
            this.sprite.position.y = context.height;
          }
    }

    __setPixels(context, x, y, color) {
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 1; j++) {
                context.set(x + i, y + j, color);
            }
        }
    }

    __isBlank(color, blankColor) {
        let bC = blankColor || [255, 255, 255];
        return color[0] == bC[0] && color[1] == bC[1] || color[2] == bC[2];
    }

    __turn(context) {
        this.__checkEdges(context);

        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        let c = context.get(x, y);
        if (!this.__isBlank(c)) {
            this.dir += 90;
            //context.set(x, y, [255, 255, 255, 255]);
            this.__setPixels(context, x, y, [255, 255, 255, 255]);
        } else {
            this.dir -=90;
            //context.set(x, y, [0, 0, 0, 255]);
            this.__setPixels(context, x, y, [0, 0, 0, 255]);
        }
    }

    draw(context) {
        this.sprite.setSpeed(1, this.dir);
        this.__turn(context);
    }
} 