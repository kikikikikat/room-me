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
            this.currentLevel.start();
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

    getCurrentLevel() {
        return this.currentLevel;
    }
}