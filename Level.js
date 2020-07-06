export default class Level {

    constructor(index, levelData) {
        this.index = index;
        this.levelData = levelData;
        this.destroyedStatus = false;
    }

    start() {
        this.levelData.start();
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