export default class LevelManager {

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