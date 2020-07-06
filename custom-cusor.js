export default class Cursor {

    constructor(offset) {
        const root = document.querySelector('html');

        // Real cursor element
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        root.appendChild(cursor);

        const offsetX = (Math.random() - 0.5) * offset;
        const offsetY = (Math.random() - 0.5) * offset;
        
        
        root.addEventListener('mousemove', (e) => {
          setPosition(cursor, e)
        })
        
        function setPosition(element, e) {
          element.style.transform = `translate3d(${e.clientX + offsetX}px, ${e.clientY + offsetY}px, 0)`
        }
    }
}
