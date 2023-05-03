export class Controls {
    constructor(cell) {
        document.addEventListener('swipe', (e) => {
            if (e.repeat) return;
            switch (e.detail.dir) {
                case 'up':
                    cell.moveUp();
                    break;
                case 'right':
                    cell.moveRight();
                    break;
                case 'down':
                    cell.moveDown();
                    break;
                case 'left':
                    cell.moveLeft();
                    break;
                default:
                    break;
            }
        })
    }
}
