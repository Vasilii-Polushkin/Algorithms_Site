import {Cell} from "./objects.js";

let rows = 130;
let cols = 130;
let squareSide = 5;
let squareRows = rows / squareSide;
let squareCols = cols / squareSide;

const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');
const extraLayer1 = document.getElementById('extraLayer1');
const context1 = layer1.getContext('2d');
const context2 = layer2.getContext('2d');
let extraCtx1 = extraLayer1.getContext('2d');

export let map = new Array(squareRows);

for (let i = 0; i < map.length; i++) {
    map[i] = new Array(squareCols);
    for (let j = 0; j < map[i].length; j++) {
        map[i][j] = new Array(squareSide * squareSide);
    }
}


function handleSquare(f, x, y, value) {
    for (let i = 0; i < squareSide; i++)
        for (let j = 0; j < squareSide; j++)
            f(x, y, i * squareSide + j, value);
}

function isEven(n) {
    return n % 2 === 0;
}

function getRandomFrom(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function setField(x, y, k, value) {
    if (x < 0 || x >= squareCols || y < 0 || y >= squareRows)
        return null;

    map[y][x][k] = value;
}

export function getField(x, y, value) {
    if (x < 0 || x >= cols || y < 0 || y >= rows)
        return null;

    return map[y][x][0];
}

function isLabyrinth() {
    for (let y = 0; y < squareRows; y++)
        for (let x = 0; x < squareCols; x++)
            if (isEven(x) && isEven(y) && getField(x, y) === '1')
                return false;

    return true;
}

function move(eraser) {
    const directs = [];

    if (eraser.x > 0)
        directs.push('left');

    if (eraser.x < squareCols - 2)
        directs.push('right');

    if (eraser.y > 0)
        directs.push('up');

    if (eraser.y < squareRows - 2)
        directs.push('down');

    const direct = getRandomFrom(directs);

    switch (direct) {
        case 'left':
            if (getField(eraser.x - 2, eraser.y) === '1') {
                handleSquare(setField, eraser.x - 1, eraser.y, '0');
                handleSquare(setField, eraser.x - 2, eraser.y, '0');
            }
            eraser.x -= 2;
            break;
        case 'right':
            if (getField(eraser.x + 2, eraser.y) === '1') {
                handleSquare(setField, eraser.x + 1, eraser.y, '0');
                handleSquare(setField, eraser.x + 2, eraser.y, '0');
            }
            eraser.x += 2;
            break;
        case 'up':
            if (getField(eraser.x, eraser.y - 2) === '1') {
                handleSquare(setField, eraser.x, eraser.y - 1, '0');
                handleSquare(setField, eraser.x, eraser.y - 2, '0');
            }
            eraser.y -= 2
            break;
        case 'down':
            if (getField(eraser.x, eraser.y + 2) === '1') {
                handleSquare(setField, eraser.x, eraser.y + 1, '0');
                handleSquare(setField, eraser.x, eraser.y + 2, '0');
            }
            eraser.y += 2;
            break;
    }
}

export function generateLabyrinth() {
    for (let y = 0; y < map.length; y++)
        for (let x = 0; x < map[y].length; x++)
            handleSquare(setField, x, y, '1');

    // выбираем случайным образом чётные координаты на карте с лабиринтом
    const startX = getRandomFrom(Array(squareCols).fill(0).map((item, index) => index).filter(x => isEven(x)));
    const startY = getRandomFrom(Array(squareRows).fill(0).map((item, index) => index).filter(y => isEven(y)));

    let eraser = {};
    eraser.x = startX;
    eraser.y = startY;

    handleSquare(setField, startX, startY, '0');

    while (!isLabyrinth())
        move(eraser);

    return map;
    /*for (let i = 0; i < rows; i++) {
        let s = "";
        for (let j = 0; j < cols; j++) {
            s = s + map[Math.floor(i / squareSide)][Math.floor(j / squareSide)][j % squareSide] + ' ';
        }
        console.log(s);
    }
    return true;*/
}

export function init() {
    layer1.width = cols * squareSide;
    layer1.height = rows * squareSide;

    context1.clearRect(0, 0, layer1.width, layer1.height);

    context1.fillStyle = 'black';
    context1.rect(0, 0, layer1.width, layer1.height);
    context1.fill();

    context1.fillStyle = '#858080';
    context1.beginPath();
    context1.rect(0, 0, layer1.width, layer1.height);
    context1.fill();
}

export let answerMap;

export function drawMap() {
    answerMap = new Array(rows * squareSide);
    for (let i = 0; i < answerMap.length; i++) {
        answerMap[i] = new Array(cols * squareSide);
        for (let j = 0; j < answerMap[i].length; j++) {
            answerMap[i][j] = new Cell();
        }
    }
    for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++)
            if (getField(Math.floor(x / squareSide), Math.floor(y / squareSide)) === '1') {
                context1.fillStyle = '#1f1f1f';
                context1.beginPath();
                context1.rect(x * squareSide, y * squareSide, squareSide, squareSide);
                context1.fill();
                for(let k = 0; k < squareSide; k++)
                    for(let l = 0; l < squareSide; l++)
                        answerMap[y * squareSide + k][x * squareSide + l].wall = true;
            }

    extraCtx1.clearRect(0, 0, layer1.width, layer1.height);
    extraCtx1.drawImage(layer1, 0, 0);
    return answerMap;
}


