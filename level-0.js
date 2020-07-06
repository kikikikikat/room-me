export default p5 => {

    let isClicked = false;

    let div;

    const start = () => {
        div = document.createElement('div');
        div.classList.add('container');
        document.body.appendChild(div);
        div.innerHTML = '<input type="checkbox" id="robot" name="robot" value=""><label for="robot"> I\'m not a robot.</label>';
        div.style.position = 'fixed';
        div.style.top = '50%';
        div.style.left = '50%';
        let checkbox = document.querySelector('#robot');
        checkbox.addEventListener('click', e => {
            isClicked = true;
        });
    }

    const draw = () => {
        p5.background(34, 55, 240);
    }

    const passCondition = () => {
        //return p5.mouseIsPressed;
        return isClicked;
    }

    const cleanup = () => {
        document.body.removeChild(div);
    }


    return {
        start,
        draw,
        passCondition,
        timeThreshold: 20000000,
        cleanup: cleanup
    }

};