import { Cell } from './cell';
import { Controls } from './controls';

export class Game {
    constructor(gameHeight, cellHeight, padding) {
        this.cellHeight = cellHeight;
        this.gameHeight = gameHeight;
        this.padding = padding;

        this.allLocations = this.generateAllLocations();
        this.gameMovingObjects = [];
        this.currentScore = 0;
        this.chance = 0.1;
        this.moveCellEnd = true;
    }

    generateAllLocations() {
        const gridLimit = this.gameHeight + this.cellHeight;
        const increment = this.cellHeight + this.padding;
        const allLocations = [];

        for (let col = 0; col < gridLimit - increment; col += increment) {
            for (let row = 0; row < gridLimit - increment; row += increment) {
                allLocations.push([row, col]);
            }
        }

        return allLocations;
    }

    generateCellId() {
        return Math.random();
    };

    calculateCurrentScore(value1 = 0, value2 = 0) {
        this.currentScore += value1;
        this.currentScore += value2;
    }

    generateRandomLocation() {
        const yesCellLocations = this.gameMovingObjects.map(cell => Object.values(cell.position));
        const noCellLocations = this.allLocations.filter(loc => !JSON.stringify(yesCellLocations).includes(JSON.stringify(loc)));
        let randomLocation = noCellLocations[parseInt(Math.random() * noCellLocations.length)];
        return randomLocation;
    }

    addCell() {
        if (this.gameMovingObjects.length >= 16) return;
        setTimeout(() => {
            let randomLocation = this.generateRandomLocation();
            const id = this.generateCellId();
            let newCell;
            if (this.gameMovingObjects.length < 3) {
                newCell = new Cell(id, this, randomLocation, 2);
            }
            else {
                newCell = new Cell(id, this, randomLocation, this.randCellValue());
            }
            this.gameMovingObjects.push(newCell);
            new Controls(newCell);
        }, 100);
    }

    randCellValue() {
        let roll = Math.random();
        let value = 2;

        if (roll < this.chance) {
            value = 4;
        }

        return value;
    }

    deleteCellById(id) {
        let unwantedElementIdx = -1;
        for (let i = 0; i < this.gameMovingObjects.length; i++) {
            if (this.gameMovingObjects[i].id === id) {
                unwantedElementIdx = i;
                break;
            }
        }
        if (unwantedElementIdx === -1) return 'Not found';
        this.gameMovingObjects.splice(unwantedElementIdx, 1);
        return 'Deleted!';
    }

    mergeCells(cell1, cell2, location) {
        const id = this.generateCellId();
        const newCell = new Cell(id, this, location, cell1.value + cell2.value);
        this.gameMovingObjects.push(newCell);
        new Controls(newCell);
        this.deleteCellById(cell1.id);
        this.deleteCellById(cell2.id);

        this.calculateCurrentScore(cell1.value, cell2.value);
    }

    update(deltaTime) {
        for (let i = 0; i < this.gameMovingObjects.length; i++) {
            const object1 = this.gameMovingObjects[i];
            for (let j = 0; j < this.gameMovingObjects.length; j++) {
                if (this.gameMovingObjects[i] === undefined || this.gameMovingObjects[j] === undefined) {
                    continue;
                }
                if (!((this.gameMovingObjects[i].id) === this.gameMovingObjects[j].id)) {
                    const object2 = this.gameMovingObjects[j];
                    object1.checkCollusion(object2);
                }
            }
        }

        this.moveCellEnd = this.gameMovingObjects.some(item => item.speed != 0)
        this.gameMovingObjects.forEach(object => object.update(deltaTime));
    }

    draw(ctx, currentScoreCtx) {
        currentScoreCtx.font = '36px areal';
        currentScoreCtx.fillStyle = '#000000';
        currentScoreCtx.fillText(String(this.currentScore), 145, 40);

        this.gameMovingObjects.forEach(object => object.draw(ctx));
    }

    getRow(rowYPos) {
        const resultRows = [];
        this.gameMovingObjects.forEach(cell => {
            if (cell.position.y === rowYPos) {
                resultRows.push(cell);
            }
        })
        return resultRows;
    }

    getColumn(colXPos) {
        const resultCols = [];
        this.gameMovingObjects.forEach(cell => {
            if (cell.position.x === colXPos) {
                resultCols.push(cell);
            }
        })
        return resultCols;
    }

    hasConsecutiveEqualValues(cells) {
        let resultBool = false;
        cells.forEach((cell, idx) => {
            if (cells[idx + 1]) {
                if (cell.value === cells[idx + 1].value) {
                    resultBool = true;
                }
            }
        })
        return resultBool;
    }

    getAllColumns() {
        const columns = [];
        for (let i = 0; i <= 375; i += 125) {
            columns.push(this.getColumn(i));
        }
        return columns;
    }

    getAllRows() {
        const rows = [];
        for (let i = 0; i <= 375; i += 125) {
            rows.push(this.getRow(i));
        }
        return rows;
    }


    checkGameOver() {
        let rows = this.getAllRows();
        let columns = this.getAllColumns();
        this.gameOverBool = true;

        if (this.gameMovingObjects.length < 16) {
            this.gameOverBool = false;
        }

        if (this.gameMovingObjects.some(item => { return item.value === 2048 })) {
            this.gameOverBool = true;
        }
        rows.forEach(row => {
            row.sort((cell1, cell2) => cell1.position.x - cell2.position.x);
            if (this.hasConsecutiveEqualValues(row)) {
                this.gameOverBool = false;
            }
        })

        columns.forEach(col => {
            col.sort((cell1, cell2) => cell1.position.y - cell2.position.y);
            if (this.hasConsecutiveEqualValues(col)) {
                this.gameOverBool = false;
            }
        })

        return this.gameOverBool;
    }
}