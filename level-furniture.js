export default p5 => {

    let sprites = [];

    const createSprites = () => {
        // order matters -> depth
        let furnitures = [
            {
                name:'windows', 
                pos: [680, 300]
            },
            {
                name:'bed', 
                pos: [1020, 570]
            },
            {
                name:'desk', 
                pos: [200, 450]
            },
            {
                name:'chair', 
                pos: [500, 520]
            },
        ];
        furnitures.forEach(f => {
            let sprite = p5.createSprite(f.pos[0], f.pos[1]);
            sprite.addAnimation('normal', `assets/${f.name}/frame-1.png`, `assets/${f.name}/frame-2.png`);
            sprite.onMousePressed = () => {
                let img = sprite.animation.images[0];
                let wOffset = f.pos[0] - img.width / 2;
                let hOffset = f.pos[1] - img.height / 2;

                let c = img.get(p5.mouseX - wOffset, p5.mouseY - hOffset);
                let alpha = c[3];
                if (alpha > 20) {
                    console.log(f.name);
                    sprite.remove();
                }
            }
            sprites.push(sprite);

        })


    }

    const createStaticSprites = () => {
        // order matters -> depth
        let walls = [
            {
                name:'back-wall', 
                pos: [620, 320]
            },
            {
                name:'ceiling', 
                pos: [640, 50]
            },
            {
                name:'floor', 
                pos: [640, 610]
            },
            {
                name:'left-wall', 
                pos: [170, 320]
            },
            {
                name:'right-wall', 
                pos: [1080, 350]
            },
        ];
        walls.forEach(f => {
            let sprite = p5.createSprite(f.pos[0], f.pos[1]);
            sprite.addAnimation('normal', `assets/room/${f.name}.png`);
            // sprite.onMousePressed = () => {
            //     let img = sprite.animation.images[0];
            //     let wOffset = f.pos[0] - img.width / 2;
            //     let hOffset = f.pos[1] - img.height / 2;

            //     let c = img.get(p5.mouseX - wOffset, p5.mouseY - hOffset);
            //     let alpha = c[3];
            //     if (alpha > 20) {
            //         console.log(f.name);
            //         sprite.remove();
            //     }
            // }
            sprites.push(sprite);

        })


    }

    p5.mouseMoved = () => {
        // areas.forEach((area, index) => {
        //     let color = uts.getColor(area);
        //     if (!color) return;
        //     if (color === 'red') {
        //         p5.removeSprite(sprites[1]);
        //     } else if (color == 'yellow') {
        //         p5.removeSprite(sprites[2]);
        //     } else if (color == 'pink') {
        //         p5.removeSprite(sprites[0]);
        //     } else if (color == 'blue') {
        //         p5.removeSprite(sprites[3]);
        //     }
        // })
    }

    const start = () => {
        createStaticSprites();
        createSprites();
    }

    const draw = () => {

        sprites.forEach(s => {
            p5.drawSprite(s);
        });
        // p5.text("X: "+ p5.mouseX, 0, p5.height/4);
        // p5.text("Y: "+ p5.mouseY, 0, p5.height/2);

    }


    const cleanup = () => {
        sprites.forEach(s => {
            p5.removeSprite(s);
        });
    }


    return {
        start,
        draw,
        cleanup: cleanup
    }

};