export default p5Instance => {


    let isDarkMode = true;

    const text = 'sometimes we wonder how other room-people are doing.';




    const start = () => {


    }



    const draw = () => {
        p5Instance.background(isDarkMode ? 20 : 240);
        p5Instance.stroke(isDarkMode ? 240 : 20);

 
        p5Instance.textAlign(p5Instance.CENTER);
        p5Instance.fill(250);
        p5Instance.text(text, p5Instance.width / 2, p5Instance.height / 2);
        
    }


    const cleanup = () => {

    }


    return {
        start,
        draw,
        cleanup
    }

};