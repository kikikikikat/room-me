export default p5 => {

    let river;

    const start = () => {
        river = p5.createSprite(640, 360);
        river.addAnimation('normal', 'assets/river/frame_00001.png', 'assets/river/frame_00005.png');
    }

    p5.mouseMoved = () => {
        console.log('moved');
    }

    const drawRect = () => {
        // let x = p5.map(p5.mouseX, 0, p5.width, 120, 720);
        // let y = p5.map(p5.mouseY, 0, p5.height, 370, 720);
        let x = p5.mouseX;
        let y = p5.mouseY;
        let scale = p5.map(p5.mouseY, 0, p5.height, .05, 1);
        p5.rectMode(p5.CENTER);
        p5.noFill();
        p5.scale(scale);
        p5.rect(x, y, 640, 414);
        
    }


    const draw = () => {
        p5.drawSprite(river);
        p5.text("X: "+ p5.mouseX, 0, p5.height/4);
        p5.text("Y: "+ p5.mouseY, 0, p5.height/2);
        drawRect();
    }


    const cleanup = () => {
        console.log('clean up river');
        p5.removeSprite(river);
    }


    return {
        start,
        draw,
        cleanup: cleanup
    }

};