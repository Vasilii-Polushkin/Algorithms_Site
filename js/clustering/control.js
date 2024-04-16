//import {canvas_K_means, K_means, ctx_K_means, Point} from "./main.js";

//import {control} from "control.js";

let inputNumberOfClusters = document.getElementById('numberOfClusters');
let numberOfClusters;


const MAX = 10000;
const canvas_K_means = document.querySelector('#K-means');
const canvas_C_means = document.querySelector('#C-means');
const canvas_Hierarchical = document.querySelector('#HierarchicalClustering');
const canvas_DBSCAN = document.querySelector('#DBSCAN');
let w = canvas_K_means.width;
let h = canvas_K_means.height;
const ctx_K_means = canvas_K_means.getContext('2d');
const ctx_C_means = canvas_C_means.getContext('2d');
const ctx_Hierarchical = canvas_Hierarchical.getContext('2d');
const ctx_DBSCAN = canvas_DBSCAN.getContext('2d');

let K_means_caption = document.getElementById('K-means_caption');
let C_means_caption = document.getElementById('C-means_caption');
let Hierarchical_caption = document.getElementById('Hierarchical_caption');
let DBSCAN_caption = document.getElementById('DBSCAN_caption');

let color = document.getElementById('K-means_caption').style.color;

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
    ctx_K_means.clearRect(0, 0, w, h);

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

function C_means() {
    ctx_C_means.clearRect(0, 0, w, h);



    let probabilityMatrix = new Array(numberOfClusters);
    for(let i = 0; i < probabilityMatrix.length; i++) {
        probabilityMatrix[i] = new Array(control.points.length);

    }
}

function AgglomerativeHierarchicalClustering () {

}

function DBSCAN () {

}


class Control {
    constructor() {
        this.points = [];

        document.addEventListener('click', this.newPoint);
        canvas_K_means.addEventListener('mouseover', this.highlight.bind(null, canvas_K_means.id, K_means_caption.id), false);
        canvas_K_means.addEventListener('mouseout', this.notHighlight.bind(null, canvas_K_means.id, K_means_caption.id), false);

        canvas_C_means.addEventListener('mouseover', this.highlight.bind(null, canvas_C_means.id, C_means_caption.id), false);
        canvas_C_means.addEventListener('mouseout', this.notHighlight.bind(null, canvas_C_means.id, C_means_caption.id), false);

        canvas_Hierarchical.addEventListener('mouseover', this.highlight.bind(null, canvas_Hierarchical.id, Hierarchical_caption.id), false);
        canvas_Hierarchical.addEventListener('mouseout', this.notHighlight.bind(null, canvas_Hierarchical.id, Hierarchical_caption.id), false);

        canvas_DBSCAN.addEventListener('mouseover', this.highlight.bind(null, canvas_DBSCAN.id, DBSCAN_caption.id), false);
        canvas_DBSCAN.addEventListener('mouseout', this.notHighlight.bind(null, canvas_DBSCAN.id, DBSCAN_caption.id), false);
    }

    newPoint = (e) => {
        let point_K_means = new Point(e.pageX - canvas_K_means.getBoundingClientRect().left, e.pageY - canvas_K_means.getBoundingClientRect().top);
        let point_C_means = new Point(e.pageX - canvas_C_means.getBoundingClientRect().left, e.pageY - canvas_C_means.getBoundingClientRect().top);
        let point_Hierarchical = new Point(e.pageX - canvas_Hierarchical.getBoundingClientRect().left, e.pageY - canvas_Hierarchical.getBoundingClientRect().top);
        let point_DBSCAN = new Point(e.pageX - canvas_DBSCAN.getBoundingClientRect().left, e.pageY - canvas_DBSCAN.getBoundingClientRect().top);

        if(point_K_means !== undefined && !this.isPointAlreadyExist(point_K_means)) {
            this.points.push(point_K_means);
            this.drawPoint(ctx_K_means, point_K_means);
            this.drawPoint(ctx_C_means, point_K_means);
            this.drawPoint(ctx_Hierarchical, point_K_means);
            this.drawPoint(ctx_DBSCAN, point_K_means);
        }

        if(point_C_means !== undefined && !this.isPointAlreadyExist(point_C_means)) {
            this.points.push(point_C_means);
            this.drawPoint(ctx_K_means, point_C_means);
            this.drawPoint(ctx_C_means, point_C_means);
            this.drawPoint(ctx_Hierarchical, point_C_means);
            this.drawPoint(ctx_DBSCAN, point_C_means);
        }

        if(point_Hierarchical !== undefined && !this.isPointAlreadyExist(point_Hierarchical)) {
            this.points.push(point_Hierarchical);
            this.drawPoint(ctx_K_means, point_Hierarchical);
            this.drawPoint(ctx_C_means, point_Hierarchical);
            this.drawPoint(ctx_Hierarchical, point_Hierarchical);
            this.drawPoint(ctx_DBSCAN, point_Hierarchical);
        }

        if(point_DBSCAN !== undefined && !this.isPointAlreadyExist(point_DBSCAN)) {
            this.points.push(point_DBSCAN);
            this.drawPoint(ctx_K_means, point_DBSCAN);
            this.drawPoint(ctx_C_means, point_DBSCAN);
            this.drawPoint(ctx_Hierarchical, point_DBSCAN);
            this.drawPoint(ctx_DBSCAN, point_DBSCAN);
        }
    }

    drawPoint = (ctx, point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }

    draw_K_means = (clusters) => {
        ctx_K_means.clearRect(0, 0, w, h);
        for (let i = 0; i < clusters.length; i++) {
            for (let j = 0; j < clusters[i].points.length; j++) {
                ctx_K_means.beginPath();
                ctx_K_means.arc(clusters[i].points[j].x, clusters[i].points[j].y, 2, 0, Math.PI * 2);
                ctx_K_means.fillStyle = clusters[i].color;
                ctx_K_means.fill();
                ctx_K_means.closePath();

                ctx_K_means.beginPath();
                ctx_K_means.moveTo(clusters[i].centre.x, clusters[i].centre.y);
                ctx_K_means.lineTo(clusters[i].points[j].x, clusters[i].points[j].y);
                ctx_K_means.strokeStyle = clusters[i].color;
                ctx_K_means.lineWidth = "1";
                ctx_K_means.stroke();
                ctx_K_means.closePath();
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

    highlight (id, id_caption) {
        document.getElementById(id).style.outline = "rgba(226, 147, 3, 0.9) 1px solid";
        document.getElementById(id_caption).style.color = 'rgba(226, 147, 3, 0.9)';
    }

    notHighlight (id, id_caption) {
        document.getElementById(id).style.outline = "#ffffff 1px solid";
        document.getElementById(id_caption).style.color = color;
        console.log(document.getElementById('C-means_caption').style.color);
    }
}

function restart () {
    ctx_K_means.clearRect(0, 0, w, h);
    ctx_C_means.clearRect(0, 0, w, h);
    ctx_Hierarchical.clearRect(0, 0, w, h);
    ctx_DBSCAN.clearRect(0, 0, w, h);

    control.points = [];
}


const alertPlaceholder = document.getElementById('alert')
const appendAlert = (message) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-warning alert-dismissible alert-light" role="alert">' +
        '<div>{message}!</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'.replace('{message}', message);

    alertPlaceholder.append(wrapper);
}

function runAlgorithm () {
    numberOfClusters = parseInt(inputNumberOfClusters.value);
    if(numberOfClusters < 1 || inputNumberOfClusters.valueAsNumber !== Math.floor(numberOfClusters) || numberOfClusters > control.points.length) {
        appendAlert('Invalid number of clusters');
        return;
    }

    K_means();
    C_means();
    AgglomerativeHierarchicalClustering();
    DBSCAN();
}

let control = new Control();
let runBtn = document.getElementById('run');
let restartBtn = document.getElementById('clear');

runBtn.addEventListener('click', runAlgorithm);
restartBtn.addEventListener('click', restart);