import {runAlgorithm, Point} from "./algorithms.js";


const canvas_K_means = document.querySelector('#K-means');
const canvas_C_means = document.querySelector('#C-means');
const canvas_Hierarchical = document.querySelector('#HierarchicalClustering');
const canvas_DBSCAN = document.querySelector('#DBSCAN');

export let ctx_K_means = canvas_K_means.getContext('2d');
export let ctx_C_means = canvas_C_means.getContext('2d');
export let ctx_Hierarchical = canvas_Hierarchical.getContext('2d');
export let ctx_DBSCAN = canvas_DBSCAN.getContext('2d');

export let w = canvas_K_means.width;
export let h = canvas_K_means.height;

let K_means_caption = document.getElementById('K-means_caption');
let C_means_caption = document.getElementById('C-means_caption');
let Hierarchical_caption = document.getElementById('Hierarchical_caption');
let DBSCAN_caption = document.getElementById('DBSCAN_caption');

let color = document.getElementById('K-means_caption').style.color;

const minPtsTooltip = document.getElementById('minPtsTooltip')
const ptsTooltip = bootstrap.Tooltip.getOrCreateInstance(minPtsTooltip);

const epsilonTooltip = document.getElementById('epsilonTooltip')
const epsTooltip = bootstrap.Tooltip.getOrCreateInstance(epsilonTooltip);


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

        this.alertPlaceholder = document.getElementById('alert')
    }

    appendAlert = (message) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = '<div class="alert alert-warning alert-dismissible alert-light" role="alert">' +
            '<div>{message}!</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'.replace('{message}', message);

        this.alertPlaceholder.append(wrapper);
    }

    isValid(point) {
        return (point.x >= 0 && point.y >= 0 && point.x < w && point.y < h);
    }

    newPoint = (e) => {
        let point_K_means = new Point(e.pageX - canvas_K_means.getBoundingClientRect().left, e.pageY - canvas_K_means.getBoundingClientRect().top);
        let point_C_means = new Point(e.pageX - canvas_C_means.getBoundingClientRect().left, e.pageY - canvas_C_means.getBoundingClientRect().top);
        let point_Hierarchical = new Point(e.pageX - canvas_Hierarchical.getBoundingClientRect().left, e.pageY - canvas_Hierarchical.getBoundingClientRect().top);
        let point_DBSCAN = new Point(e.pageX - canvas_DBSCAN.getBoundingClientRect().left, e.pageY - canvas_DBSCAN.getBoundingClientRect().top);

        if (this.isValid(point_K_means) && !this.isPointAlreadyExist(point_K_means)) {
            this.points.push(point_K_means);
            this.drawPoint(ctx_K_means, point_K_means);
            this.drawPoint(ctx_C_means, point_K_means);
            this.drawPoint(ctx_Hierarchical, point_K_means);
            this.drawPoint(ctx_DBSCAN, point_K_means);
        }

        if (this.isValid(point_C_means) && !this.isPointAlreadyExist(point_C_means)) {
            this.points.push(point_C_means);
            this.drawPoint(ctx_K_means, point_C_means);
            this.drawPoint(ctx_C_means, point_C_means);
            this.drawPoint(ctx_Hierarchical, point_C_means);
            this.drawPoint(ctx_DBSCAN, point_C_means);
        }

        if (this.isValid(point_Hierarchical) && !this.isPointAlreadyExist(point_Hierarchical)) {
            this.points.push(point_Hierarchical);
            this.drawPoint(ctx_K_means, point_Hierarchical);
            this.drawPoint(ctx_C_means, point_Hierarchical);
            this.drawPoint(ctx_Hierarchical, point_Hierarchical);
            this.drawPoint(ctx_DBSCAN, point_Hierarchical);
        }

        if (this.isValid(point_DBSCAN) && !this.isPointAlreadyExist(point_DBSCAN)) {
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

    draw = (clusters, ctx) => {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < clusters.length; i++) {
            ctx.fillStyle = clusters[i].color;
            ctx.beginPath();
            ctx.arc(clusters[i].centre.x, clusters[i].centre.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

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
        for (let i = 0; i < this.points.length; i++) {
            if (point.x === this.points[i].x && point.y === this.points[i].y)
                return true;
        }
        return false;
    }

    highlight(id, id_caption) {
        document.getElementById(id).style.outline = "rgba(226, 147, 3, 0.9) 1px solid";
        document.getElementById(id_caption).style.color = 'rgba(226, 147, 3, 0.9)';
    }

    notHighlight(id, id_caption) {
        document.getElementById(id).style.outline = "#ffffff 1px solid";
        document.getElementById(id_caption).style.color = color;
    }
}

function restart() {
    ctx_K_means.clearRect(0, 0, w, h);
    ctx_C_means.clearRect(0, 0, w, h);
    ctx_Hierarchical.clearRect(0, 0, w, h);
    ctx_DBSCAN.clearRect(0, 0, w, h);

    control.points = [];
}


export let control = new Control();
let runBtn = document.getElementById('run');
let restartBtn = document.getElementById('clear');

runBtn.addEventListener('click', runAlgorithm);
restartBtn.addEventListener('click', restart);