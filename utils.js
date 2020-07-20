export default (p5) => {

    const getColor = (area, mouseX, mouseY) => {        
        let x = mouseX || p5.mouseX;
        let y = mouseY || p5.mouseY;
        let result = '';
        let [r, g, b, a] = area.get(x, y);
        if (r > 200 && g < 50 && b < 50) {
            result = 'red';
        } else if (r < 50 && g > 200 && b < 50) {
            result = 'green';
        } else if (r < 50 && g < 50 && b > 200) {
            result = 'blue';
        } else if (r > 200 && g > 200 && b < 50) {
            result = 'yellow';
        } else if (r > 200 && g < 50 && b > 200) {
            result = 'pink';
        }
        return result;
    };

    return {
        getColor
    }

};