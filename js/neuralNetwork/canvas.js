import {Matrix, feedForward, Network} from "./nn.js";
import network from "./trainedNetwork.json" assert {type: "json"}

window.addEventListener('load', () => {
    resize();
    document.addEventListener('mousedown', startPainting);
    document.addEventListener('mouseup', stopPainting);
    document.addEventListener('mousemove', sketch);
});

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let squareWidth = 28;
let squareHeight = 28;
let w = ctx.canvas.width;
let h = ctx.canvas.height;

let input = new Array(squareHeight).fill(0).map(() => new Array(squareWidth).fill(0));

const answerDigit = document.getElementById('answerDigit');
answerDigit.innerHTML = '?';

const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', function () {
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext("2d");
    input = new Array(squareHeight).fill(0).map(() => new Array(squareWidth).fill(0));
    answerDigit.innerHTML = '?';
});

const answerButton = document.getElementById('answer');
answerButton.addEventListener('click', function () {
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext("2d", { willReadFrequently: true });

    const imageData = ctx.getImageData(0, 0, w, h);
    let pixels = imageData.data;

    let activations = new Array(network.sizes.length);
    for (let i = 0; i < activations.length; i++)
        activations[i] = new Matrix(network.sizes[i], 1);

    for (let i = 0; i < h; i += h / squareHeight)
        for (let j = 0; j < w * 4; j += w * 4 / squareWidth)
            activations[0].data[(i / (h / squareHeight)) * squareWidth + j / (w / squareWidth * 4)][0] = (pixels[i * w * 4 + j] / 255 +
                pixels[i * w * 4 + j + 1] / 255 + pixels[i * w * 4 + j + 2] / 255) / 3;

    activations = feedForward(network, activations);

    let answer = 0;
    let mx = 0;
    for(let i = 0; i < 10; i++){
        if(activations[2].data[i][0] > mx){
            mx = activations[2].data[i][0];
            answer = i;
        }
    }

    answerDigit.innerHTML = answer;
});

function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, w, h)
    let dx = w / squareWidth;
    let dy = h / squareHeight;

    for (let i = 0; i < squareWidth; i++) {
        for (let j = 0; j < squareHeight; j++) {
            let temp = input[i][j] * 255;

            ctx.fillStyle = 'rgb(' + temp + "," + temp + "," + temp + ")";
            ctx.fillRect(dx * j, dy * i, dx, dy);
        }
    }
}

function resize() {
    ctx.canvas.width = 560;
    ctx.canvas.height = 560;
}

let coord = {x: 0, y: 0};
let paint = false;

function getPosition(event) {
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop;

    let dx = w / squareWidth;
    let dy = h / squareHeight;
    if (event.buttons === 1) {
        for (let i = 0; i < squareHeight; i++) {
            for (let j = 0; j < squareWidth; j++) {
                let sx = dx * i;
                let ex = dx * i + dx;
                let sy = dy * j;
                let ey = dy * j + dy;

                if (sx < coord.x && ex > coord.x && sy < coord.y && ey > coord.y) {
                    input[j][i] = Math.min(input[j][i] + 0.2, 1);
                }
                if (Math.abs((sx + ex) / 2 - coord.x) < 15 && Math.abs((sy + ey) / 2 - coord.y) < 15) {
                    input[j][i] = Math.min(input[j][i] + 0.2, 1);
                }
                if (Math.abs((sx + ex) / 2 - coord.x) < 25 && Math.abs((sy + ey) / 2 - coord.y) < 25) {
                    input[j][i] = Math.min(input[j][i] + 0.2, 1);
                }
            }
        }
    }
    if (event.buttons === 4) {
        for (let i = 0; i < squareHeight; i++) {
            for (let j = 0; j < squareWidth; j++) {
                let sx = dx * i;
                let ex = dx * i + dx;
                let sy = dy * j;
                let ey = dy * j + dy;

                if (sx < coord.x && ex > coord.x && sy < coord.y && ey > coord.y) {
                    input[j][i] = Math.max(input[j][i] - 0.2, 0);
                }
                if (Math.abs((sx + ex) / 2 - coord.x) < 15 && Math.abs((sy + ey) / 2 - coord.y) < 15) {
                    input[j][i] = Math.max(input[j][i] - 0.2, 0);
                }
                if (Math.abs((sx + ex) / 2 - coord.x) < 25 && Math.abs((sy + ey) / 2 - coord.y) < 25) {
                    input[j][i] = Math.max(input[j][i] - 0.2, 0);
                }
            }
        }
    }
}

function startPainting(event) {
    paint = true;
    getPosition(event);
}

function stopPainting() {
    paint = false;
}

function sketch(event) {
    if (!paint) return;
    ctx.beginPath();

    ctx.lineWidth = 10;

    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';

    ctx.moveTo(coord.x, coord.y);
    getPosition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
}

requestAnimationFrame(loop);