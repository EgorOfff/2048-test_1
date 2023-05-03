import './style.css'
import { Game } from './game';
import { swipe } from './swipe'

const canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');

const currentScoreCanvas = document.getElementById('score-value-canvas');
const currentScoreCtx = currentScoreCanvas.getContext('2d');

const padding = 10;
const GAME_HEIGHT = 510;
const CELL_HEIGHT = (GAME_HEIGHT / 4) - padding;

let game = new Game(GAME_HEIGHT, CELL_HEIGHT, padding);
let lastTime = 0;
swipe(canvas, { maxTime: 1000, minTime: 100, maxDist: 150, minDist: 60 });

document.addEventListener('DOMContentLoaded', function () {

    openGame()

    if (game.moveCellEnd) {
        canvas.addEventListener('swipe', (e) => {
            if (e.detail) {
                game.addCell();
            }
        }, false);
    }

    gameLoop();

    function openGame() {
        ctx.clearRect(0, 0, GAME_HEIGHT, GAME_HEIGHT);
        const myReq = requestAnimationFrame(gameLoop);
        game.currentScore = 0;
        game.addCell();
        game.addCell();
    }

    function gameLoop(timeStamp) {
        console.log(game.moveCellEnd);

        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        currentScoreCtx.clearRect(130, 0, 100, 100);
        ctx.clearRect(0, 0, GAME_HEIGHT, GAME_HEIGHT);

        game.update(deltaTime);
        game.draw(ctx, currentScoreCtx);
        const myReq = requestAnimationFrame(gameLoop);

        if (game.checkGameOver()) {
            alert('Нельзя сделать ход');
            ctx.clearRect(0, 0, GAME_HEIGHT, GAME_HEIGHT);
            currentScoreCtx.clearRect(130, 0, 100, 100);
            game.currentScore = 0;
            game.gameMovingObjects = [];
            game.gameOverBool = false;
            game.addCell();
            game.addCell();
            gameLoop();
        }
    }
})