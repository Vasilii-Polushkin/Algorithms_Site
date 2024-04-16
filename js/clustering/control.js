//import {canvas_K_means, K_means, ctx, Point} from "./main.js";

//import {control} from "control.js";

let inputNumberOfClusters = document.getElementById('numberOfClusters');
let numberOfClusters;


const MAX = 10000;
const canvas_K_means = document.querySelector('#K-means');
let w = canvas_K_means.width;
let h = canvas_K_means.height;
const ctx = canvas_K_means.getContext('2d');


export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Cluster {
    color = getRandomColor();
    points = [];

    constructor(point) {
        this.centre = point;
    }
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function K_means() {
    ctx.clearRect(0, 0, w, h);

    // choose centres of clusters using k-means++ algorithm
    let clusters = [];
    let temp = Math.floor(Math.random() * control.points.length) % control.points.length;
    let cluster = new Cluster(control.points[temp]);
    cluster.points.push(cluster.centre);
    clusters.push(cluster);


    while (clusters.length !== numberOfClusters) {
        let probabilities = new Array(control.points.length);
        let sum = 0;

        let distances = new Array(control.points.length);
        distances.fill(MAX);

        for (let i = 0; i < distances.length; i++) {
            for (let j = 0; j < clusters.length; j++) {
                let x = control.points[i].x - clusters[j].centre.x;
                let y = control.points[i].y - clusters[j].centre.y;

                x *= x;
                y *= y;

                distances[i] = Math.min(distances[i], x + y);
            }
            sum += distances[i];
        }

        probabilities[0] = distances[0] / sum;
        for (let i = 1; i < probabilities.length; i++) {
            probabilities[i] = distances[i] / sum + probabilities[i - 1];
        }

        temp = Math.random();
        let next = 0;
        for (let i = 1; i < probabilities.length; i++) {
            if (temp > probabilities[i - 1] && temp < probabilities[i]) {
                next = i;
                break;
            }
        }

        cluster = new Cluster(control.points[next]);
        cluster.points.push(cluster.centre);
        clusters.push(cluster);
    }


    let numberOfMatches;

    // main k-means algorithm
    do {
        numberOfMatches = 0;
        for (let i = 0; i < control.points.length; i++) {
            // отнести точку к кластеру, к центру которого она оказалась ближе
            let minDistance = MAX;
            let clusterIndex;
            for (let j = 0; j < clusters.length; j++) {
                let distance = Math.sqrt((clusters[j].centre.x - control.points[i].x) ** 2 + (clusters[j].centre.y - control.points[i].y) ** 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    clusterIndex = j;
                }
            }
            clusters[clusterIndex].points.push(control.points[i]);
        }

        for (let i = 0; i < clusters.length; i++) {
            let sumX = 0;
            let sumY = 0;
            for (let j = 0; j < clusters[i].points.length; j++) {
                sumX += clusters[i].points[j].x;
                sumY += clusters[i].points[j].y;
            }

            let newCentre = new Point(Math.floor(sumX / clusters[i].points.length), Math.floor(sumY / clusters[i].points.length));
            if (clusters[i].centre.x === newCentre.x && clusters[i].centre.y === newCentre.y) {
                numberOfMatches++;
            }
            clusters[i].centre = newCentre;
        }

        if(numberOfMatches !== clusters.length) {
            for (let i = 0; i < clusters.length; i++)
                clusters[i].points = [];
        }
    } while (numberOfMatches !== clusters.length)

    control.draw_K_means(clusters);
}

function AgglomerativeHierarchicalClustering () {

}

function DBSCAN () {

}


class Control {
    constructor() {
        this.points = [];

        canvas_K_means.addEventListener('click', this.newPoint);
    }

    newPoint = (e) => {
        let point = new Point(e.pageX - canvas_K_means.getBoundingClientRect().left, e.pageY - canvas_K_means.getBoundingClientRect().top);
        if(!this.isPointAlreadyExist(point)) {
            this.points.push(point);
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.closePath();
        }
    }

    draw_K_means = (clusters) => {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        for (let i = 0; i < clusters.length; i++) {
            for (let j = 0; j < clusters[i].points.length; j++) {
                ctx.beginPath();
                ctx.arc(clusters[i].points[j].x, clusters[i].points[j].y, 2, 0, Math.PI * 2);
                ctx.fillStyle = clusters[i].color;
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.moveTo(clusters[i].centre.x, clusters[i].centre.y);
                ctx.lineTo(clusters[i].points[j].x, clusters[i].points[j].y);
                ctx.strokeStyle = clusters[i].color;
                ctx.lineWidth = "1";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    isPointAlreadyExist = (point) => {
        for(let i = 0; i < this.points.length; i++) {
            if(point.x === this.points[i].x && point.y === this.points[i].y)
                return true;
        }
        return false;
    }
}

function restart () {
    ctx.clearRect(0, 0, w, h);

    control.points = [];
}

function runAlgorithm () {
    numberOfClusters = parseInt(inputNumberOfClusters.value);
    if(numberOfClusters < 1 || inputNumberOfClusters.valueAsNumber !== Math.floor(numberOfClusters) || numberOfClusters > control.points.length) {

        return;
    }

    K_means();
    AgglomerativeHierarchicalClustering();
    DBSCAN();
}

let control = new Control();
let runBtn = document.getElementById('run');
let restartBtn = document.getElementById('clear');

runBtn.addEventListener('click', runAlgorithm);
restartBtn.addEventListener('click', restart);