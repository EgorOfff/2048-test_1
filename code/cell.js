
// Class for cells
export class Cell {
    constructor(id, game, location, value) {
        this.id = id;
        this.cellHeight = game.cellHeight;
        this.gameHeight = game.gameHeight;
        this.padding = game.padding;
        this.position = {
            x: location[0],
            y: location[1]
        };
        this.game = game;
        this.value = value;
        this.maxSpeed = 70;
        this.speed = 0;
        this.movementAxis = 'x';
        this.backgroundColors = {
            2: '#eee4d9',
            4: '#ede0c7',
            8: '#f9b376',
            16: '#ff9b60',
            32: '#ca6a49',
            64: '#ec6233',
            128: '#e8c562',
            256: '#dfba55',
            512: '#f3c54b',
            1024: '#f2c138',
            2048: '#f2bd28'
        };
    }

    draw(ctx) {
        ctx.fillStyle = this.value > 2048 ? '#000000' : this.backgroundColors[this.value];
        ctx.fillRect(this.position.x, this.position.y, this.cellHeight, this.cellHeight, 10);
        // ctx.fill();
        ctx.font = '60px sans-serif';
        ctx.fillStyle = '#000000';

        if (this.value < 10) {
            ctx.fillText(this.value, this.position.x + 40, this.position.y + 80);
        } else if (this.value >= 10 && this.value < 100) {
            ctx.fillText(this.value, this.position.x + 23, this.position.y + 80);
        } else if (this.value >= 100 && this.value < 1000) {
            ctx.fillText(this.value, this.position.x + 9, this.position.y + 80);
        } else if (this.value >= 1000 && this.value < 10000) {
            ctx.font = '48px sans-serif';
            ctx.fillText(this.value, this.position.x + 5, this.position.y + 80);
        }
    }

    get top() { return this.position.y };
    get right() { return this.position.x + this.cellHeight };
    get bottom() { return this.position.y + this.cellHeight };
    get left() { return this.position.x };

    checkCollusion(cell) {
        if (
            this.bottom < cell.top
            || this.left > cell.right
            || this.top > cell.bottom
            || this.right < cell.left) {
            this.topColided = false
            this.bottomColided = false
            this.rightColided = false
            this.leftColided = false
            return false;
        } else {
            // top to bottom
            if (cell.speed < 0 && cell.movementAxis === 'y' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(this.position));
            }
            else if (this.speed < 0 && this.movementAxis === 'y' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(cell.position));
            }
            else if (this.speed < 0 && this.movementAxis === 'y') {
                this.topColided = true;
                this.speed = 0;
                this.position['y'] = cell.position.y + this.padding + this.cellHeight;
            }
            else if (cell.speed < 0 && cell.movementAxis === 'y') {
                cell.topColided = true;
                cell.speed = 0;
                cell.position['y'] = this.position.y + cell.padding + cell.cellHeight;
            }

            // bottom to top
            else if (this.speed > 0 && this.movementAxis === 'y' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(cell.position));
            }
            else if (cell.speed > 0 && cell.movementAxis === 'y' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(this.position));
            }
            else if (cell.speed > 0 && cell.movementAxis === 'y') {
                cell.bottomColided = true;
                cell.speed = 0;
                cell.position['y'] = this.position.y - cell.padding - cell.cellHeight;
            }
            else if (this.speed > 0 && this.movementAxis === 'y') {
                this.bottomColided = true;
                this.speed = 0;
                this.position['y'] = cell.position.y - this.padding - this.cellHeight;
            }

            // left to right
            else if (this.speed > 0 && this.movementAxis === 'x' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(cell.position));
            }
            else if (cell.speed > 0 && cell.movementAxis === 'x' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(this.position));
            }
            else if (this.speed > 0 && this.movementAxis === 'x') {
                this.rightColided = true;
                this.speed = 0;
                this.position['x'] = cell.position.x - this.padding - this.cellHeight;
            }
            else if (cell.speed > 0 && cell.movementAxis === 'x') {
                cell.rightColided = true;
                cell.speed = 0;
                cell.position['x'] = this.position.x - cell.padding - cell.cellHeight;
            }


            // right to left
            else if (this.speed < 0 && this.movementAxis === 'x' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(cell.position));
            }
            else if (cell.speed < 0 && cell.movementAxis === 'x' && this.value === cell.value) {
                this.game.mergeCells(this, cell, Object.values(this.position));
            }
            else if (this.speed < 0 && this.movementAxis === 'x') {
                this.leftColided = true;
                this.speed = 0;
                this.position['x'] = cell.position.x + this.padding + this.cellHeight;
            }
            else if (cell.speed < 0 && cell.movementAxis === 'x') {
                cell.leftColided = true;
                cell.speed = 0;
                cell.position['x'] = this.position.x + cell.padding + cell.cellHeight;
            }

            this.isCollided = true;
            return true;
        }
    }

    update(deltaTime) {
        if (!deltaTime) return;
        this.position[this.movementAxis] += this.speed;
        if (this.position.x < 0) {
            this.speed = 0;
            this.position.x = 0;
        } else if (this.position.x > this.gameHeight - this.cellHeight - this.padding) {
            this.speed = 0;
            this.position.x = this.gameHeight - this.cellHeight - this.padding;
        } else if (this.position.y < 0) {
            this.speed = 0;
            this.position.y = 0;
        } else if (this.position.y > this.gameHeight - this.cellHeight - this.padding) {
            this.speed = 0;
            this.position.y = this.gameHeight - this.cellHeight - this.padding;
        }
    }

    moveRight() {
        if (this.speed != 0) return;
        this.movementAxis = 'x';
        this.speed = this.maxSpeed;
    }

    moveLeft() {
        if (this.speed != 0) return;
        this.movementAxis = 'x';
        this.speed = -this.maxSpeed;
    }

    moveUp() {
        if (this.speed != 0) return;
        this.movementAxis = 'y';
        this.speed = -this.maxSpeed;
    }

    moveDown() {
        if (this.speed != 0) return;
        this.movementAxis = 'y';
        this.speed = this.maxSpeed;
    }
}