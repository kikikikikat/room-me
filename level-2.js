import Cursor from './custom-cusor.js';

export default p5 => {
    let isClicked = false;

    let div, cursor;

    const start = () => {

        div = document.createElement('div');
        div.classList.add('container');
        document.body.appendChild(div);
        div.innerHTML = '<input type="checkbox" id="robot" name="robot" value=""><label for="robot"> I\'m not a robot.</label>';
        div.style.position = 'fixed';
        div.style.top = Math.round(Math.random() * 100)  + '%';
        div.style.left = Math.round(Math.random() * 100)  + '%';
        let checkbox = document.querySelector('#robot');
        checkbox.addEventListener('click', e => {
            isClicked = true;
        });

        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link rel=\"stylesheet\" href=\"/level-2.css\" />");

        const numCursors = 100;
        for (let i = 0; i < numCursors; i++) {
            new Cursor(i * Math.random() * 100);
        }

        setInterval(() => {
            div.style.top = Math.round(Math.random() * 100)  + '%';
            div.style.left = Math.round(Math.random() * 100)  + '%';
        }, 1500);

    }

    const draw = () => {
        p5.background(34, 255, 140);
    }

    const passCondition = () => {
        //return p5.mouseIsPressed;
        return isClicked;
    }

    const cleanup = () => {
        if (document.body.contains(div)) {
            document.body.removeChild(div);
        }
    }


    return {
        start,
        draw,
        passCondition,
        timeThreshold: 20000000,
        cleanup: cleanup
    }
};