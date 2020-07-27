export default class DLAParticle {
    constructor(p5Instance, x, y, context, opts) {
        var opts = opts || {};
        this.sprite = p5Instance.createSprite(x, y, 10, 10);
        this.dir = p5Instance.random(0, 360);
        this.context = context;
        this.p5 = p5Instance;

        this.wiggleAngle = opts.wiggleAngle || 60;
    }

    __setPixels(x, y, color) {
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 1; j++) {
                this.context.set(x + i, y + j, color);
            }
        }
    }

    __checkAnyNeighborIsColor(x, y, color) {
        let result = false;
        let neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y + 1],
            [x, y - 1],
            [x + 1, y + 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [y + 1, y - 1]
        ];

        neighbors.forEach(n => {
            let c = this.context.get(n[0], n[1]);
            if ((c[0] == color[0]) && (c[1] == color[1]) && (c[2] == color[2])) {
                result = true;
            }
        })
        return result;
    }

    draw() {
        this.dir += this.p5.random(0, this.wiggleAngle);
        this.dir -= this.p5.random(0, this.wiggleAngle);
        this.sprite.setSpeed(1, this.dir);
        let x = this.sprite.position.x;
        let y = this.sprite.position.y;
        if (this.__checkAnyNeighborIsColor(x, y, [0, 0, 0])) {
            this.__setPixels(x, y, [0, 0, 0, 255]);
        }
    }
}