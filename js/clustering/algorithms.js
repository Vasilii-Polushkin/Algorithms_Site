import {control, w, h, ctx_K_means, ctx_C_means, ctx_Hierarchical, ctx_DBSCAN} from "./control.js";

const MAX = 10000;
const fuzzinessParam = 2;
const toleranceValue = 0.000001;
let inputNumberOfClusters = document.getElementById('numberOfClusters');
let numberOfClusters;


function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.used = false;
    }
}

class Cluster {
    color = getRandomColor();
    points = [];

    constructor(point) {
        this.centre = point;
    }
}


function K_means() {

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

        if (numberOfMatches !== clusters.length) {
            for (let i = 0; i < clusters.length; i++)
                clusters[i].points = [];
        }
    } while (numberOfMatches !== clusters.length)

    control.draw(clusters, ctx_K_means);
}

function C_means() {

    let clusters = new Array(numberOfClusters);

    let sum = new Array(control.points.length);
    sum.fill(0);

    let probabilityMatrix = new Array(clusters.length);
    for (let i = 0; i < probabilityMatrix.length; i++) {
        probabilityMatrix[i] = new Array(control.points.length);
        for (let j = 0; j < probabilityMatrix[i].length; j++) {
            probabilityMatrix[i][j] = Math.random();
            sum[j] += probabilityMatrix[i][j];
        }
    }

    for (let i = 0; i < probabilityMatrix.length; i++)
        for (let j = 0; j < probabilityMatrix[i].length; j++)
            probabilityMatrix[i][j] /= sum[j];


    let numberOfConverged;
    let BREAK = false;
    do {
        let numberOfConverged = 0;

        // calculating centroids
        for (let i = 0; i < clusters.length; i++) {
            let x = 0;
            let y = 0;
            let sum = 0;
            for (let j = 0; j < control.points.length; j++) {
                sum += probabilityMatrix[i][j] ** fuzzinessParam;
                x += (probabilityMatrix[i][j] ** fuzzinessParam) * control.points[j].x;
                y += (probabilityMatrix[i][j] ** fuzzinessParam) * control.points[j].y;
            }
            //TODO Z??
            let centre = new Point(x / sum, y / sum);
            clusters[i] = new Cluster(centre);
        }

        // finding distances
        let distances = new Array(control.points.length);
        for (let i = 0; i < distances.length; i++) {
            distances[i] = new Array(clusters.length);
            for (let j = 0; j < distances[i].length; j++) {
                distances[i][j] = Math.sqrt((control.points[i].x - clusters[j].centre.x) ** 2 + (control.points[i].y - clusters[j].centre.y) ** 2);
            }
            // recalculating probabilities
            let sum = 0;
            for (let j = 0; j < distances[i].length; j++) {
                sum += (1 / distances[i][j]) ** 2;
            }
            for (let j = 0; j < distances[i].length; j++) {
                let newProbability = (((distances[i][j] ** 2) * sum) ** (1 / (fuzzinessParam - 1))) ** (-1);
                if (Math.abs(newProbability - probabilityMatrix[j][i]) < toleranceValue) {
                    //numberOfConverged++;
                    BREAK = true;
                }
                probabilityMatrix[j][i] = newProbability;
            }
        }
    } while (/*numberOfConverged !== clusters.length * control.points.length*/!BREAK)


    // group by clusters
    for(let j = 0; j < probabilityMatrix[0].length; j++) {
        if (!control.points[j].used) {
            let max = 0;
            let ind;
            for (let i = 0; i < probabilityMatrix.length; i++) {
                if (probabilityMatrix[i][j] > max) {
                    max = probabilityMatrix[i][j];
                    ind = i;
                }
            }
            clusters[ind].points.push(control.points[j]);
            control.points[j].used = true;
        }
    }

    /*for(let i = 1; i < probabilityMatrix.length; i++)
        for(let j = 0; j < probabilityMatrix[i].length; j++)
            probabilityMatrix[i][j] = probabilityMatrix[i][j] + probabilityMatrix[i - 1][j];


    let temp = new Array(control.points.length);
    for(let j = 0; j < temp.length; j++)
        temp[j] = Math.random();

    for(let j = 0; j < probabilityMatrix[0].length; j++) {
        if(probabilityMatrix[0][j] >= temp[j]) {
            clusters[0].points.push(control.points[j]);
            control.points[j].used = true;
        }
    }

    for(let j = 0; j < probabilityMatrix[0].length; j++) {
        for (let i = 1; i < probabilityMatrix.length; i++) {
            if(probabilityMatrix[i - 1][j] < temp[j] && probabilityMatrix[i][j] > temp[j] && !control.points[j].used){
                clusters[i].points.push(control.points[j]);
                control.points[j].used = true;
            }
        }
    }*/

    for(let i = 0; i < control.points.length; i++)
        control.points[i].used = false;

    control.draw(clusters, ctx_C_means);
}

function AgglomerativeHierarchicalClustering() {
}

function DBSCAN() {

}

export function runAlgorithm() {
    numberOfClusters = parseInt(inputNumberOfClusters.value);
    if (numberOfClusters < 1 || inputNumberOfClusters.valueAsNumber !== Math.floor(numberOfClusters) || numberOfClusters > control.points.length) {
        control.appendAlert('Invalid number of clusters');
        return;
    }

    K_means();
    C_means();
    AgglomerativeHierarchicalClustering();
    DBSCAN();
}