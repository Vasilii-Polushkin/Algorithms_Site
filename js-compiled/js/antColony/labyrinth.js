import { rows, cols, squareRows, squareCols, squareSide, map } from "./draw.js";
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
function move(tractor) {
    const directs = [];
    if (tractor.x > 0)
        directs.push('left');
    if (tractor.x < squareCols - 2)
        directs.push('right');
    if (tractor.y > 0)
        directs.push('up');
    if (tractor.y < squareRows - 2)
        directs.push('down');
    const direct = getRandomFrom(directs);
    switch (direct) {
        case 'left':
            if (getField(tractor.x - 2, tractor.y) === '1') {
                handleSquare(setField, tractor.x - 1, tractor.y, '0');
                handleSquare(setField, tractor.x - 2, tractor.y, '0');
            }
            tractor.x -= 2;
            break;
        case 'right':
            if (getField(tractor.x + 2, tractor.y) === '1') {
                handleSquare(setField, tractor.x + 1, tractor.y, '0');
                handleSquare(setField, tractor.x + 2, tractor.y, '0');
            }
            tractor.x += 2;
            break;
        case 'up':
            if (getField(tractor.x, tractor.y - 2) === '1') {
                handleSquare(setField, tractor.x, tractor.y - 1, '0');
                handleSquare(setField, tractor.x, tractor.y - 2, '0');
            }
            tractor.y -= 2;
            break;
        case 'down':
            if (getField(tractor.x, tractor.y + 2) === '1') {
                handleSquare(setField, tractor.x, tractor.y + 1, '0');
                handleSquare(setField, tractor.x, tractor.y + 2, '0');
            }
            tractor.y += 2;
            break;
    }
}
export function generateLabyrinth() {
    for (let y = 0; y < map.length; y++)
        for (let x = 0; x < map[y].length; x++)
            handleSquare(setField, x, y, '1');
    // выбираем случайным образом чётные координаты на карте с лабиринтом
    //const startX = getRandomFrom(Array(squareCols).fill(0).map((item, index) => index).filter(x => isEven(x)));
    //const startY = getRandomFrom(Array(squareRows).fill(0).map((item, index) => index).filter(y => isEven(y)));
    const startX = 0;
    const startY = 0;
    let tractor = {};
    tractor.x = startX;
    tractor.y = startY;
    handleSquare(setField, startX, startY, '0');
    while (!isLabyrinth())
        move(tractor);
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
//# sourceMappingURL=labyrinth.js.map