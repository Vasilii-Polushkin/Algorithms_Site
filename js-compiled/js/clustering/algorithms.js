import { control, ctx_C_means, ctx_DBSCAN, ctx_Hierarchical, ctx_K_means } from "./control.js";
const MAX = 10000;
const fuzzinessParam = 2;
const toleranceValue = 0.01;
let inputNumberOfClusters = document.getElementById('numberOfClusters');
let numberOfClusters;
let minPtsInput = document.getElementById('minPts');
let minPts;
let epsilonInput = document.getElementById('epsilon');
let epsilon;
const validNumberOfClusters = document.getElementById('validNumberOfClusters');
const notValidNumberToast = bootstrap.Toast.getOrCreateInstance(validNumberOfClusters);
const validMinPts = document.getElementById('validMinPts');
const notValidMinPts = bootstrap.Toast.getOrCreateInstance(validMinPts);
const validEpsilon = document.getElementById('validEpsilon');
const notValidEpsilon = bootstrap.Toast.getOrCreateInstance(validEpsilon);
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
class Pair {
    constructor(distance, ind) {
        this.distance = distance;
        this.ind = ind;
    }
}
class PairOfClusters {
    constructor(first, second, distance) {
        this.first = first;
        this.second = second;
        this.distance = distance;
    }
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
    } while (numberOfMatches !== clusters.length);
    control.draw(clusters, ctx_K_means);
}
function C_means() {
    let clusters = new Array(numberOfClusters);
    if (control.points.length === 1) {
        let cluster = new Cluster(control.points[0]);
        cluster.points.push(control.points[0]);
        clusters[0] = cluster;
        control.draw(clusters, ctx_C_means);
        return;
    }
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
    let BREAK = false;
    do {
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
                    BREAK = true;
                }
                probabilityMatrix[j][i] = newProbability;
            }
        }
    } while (!BREAK);
    // group by clusters
    for (let j = 0; j < probabilityMatrix[0].length; j++) {
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
    for (let i = 0; i < control.points.length; i++)
        control.points[i].used = false;
    control.draw(clusters, ctx_C_means);
}
function AgglomerativeHierarchicalClustering() {
    let clusters = new Array(control.points.length);
    for (let i = 0; i < clusters.length; i++) {
        let point = new Point(control.points[i].x, control.points[i].y);
        clusters[i] = new Cluster(point);
        clusters[i].points.push(point);
    }
    while (clusters.length !== numberOfClusters) {
        let distances = new Array(clusters.length);
        for (let i = 0; i < distances.length; i++) {
            distances[i] = new Array(clusters.length);
            for (let j = 0; j < distances[i].length; j++) {
                let pair = new Pair(Math.sqrt((clusters[i].centre.x - clusters[j].centre.x) ** 2 + (clusters[i].centre.y - clusters[j].centre.y) ** 2), j);
                distances[i][j] = pair;
            }
        }
        for (let i = 0; i < distances.length; i++) {
            distances[i].sort(function (a, b) {
                return (b.distance < a.distance) - (a.distance < b.distance);
            });
        }
        let newClusters = [];
        let priority = 1;
        let count = distances.length;
        let pairs = [];
        while (count > 1) {
            count = 0;
            for (let i = 0; i < distances.length; i++) {
                for (let j = 1; j < distances[i].length; j++) {
                    if (!clusters[i].centre.used && !clusters[distances[i][j].ind].centre.used && distances[i][j].distance === distances[distances[i][j].ind][priority].distance) {
                        count++;
                        clusters[i].centre.used = true;
                        clusters[distances[i][j].ind].centre.used = true;
                        let pair = new PairOfClusters(i, distances[i][j].ind, distances[i][j].distance);
                        pairs.push(pair);
                    }
                }
            }
            priority++;
        }
        pairs.sort(function (a, b) {
            return (b.distance < a.distance) - (a.distance < b.distance);
        });
        for (let i = 0; i < pairs.length; i++) {
            let first = pairs[i].first;
            let second = pairs[i].second;
            if (clusters.length - newClusters.length === numberOfClusters) {
                clusters[first].centre.used = false;
                clusters[second].centre.used = false;
            }
            else {
                for (let k = 0; k < clusters[second].points.length; k++)
                    clusters[first].points.push(clusters[second].points[k]);
                let x = 0;
                let y = 0;
                for (let k = 0; k < clusters[first].points.length; k++) {
                    x += clusters[first].points[k].x;
                    y += clusters[first].points[k].y;
                }
                clusters[first].centre = new Point(x / clusters[first].points.length, y / clusters[first].points.length);
                clusters[first].centre.used = true;
                newClusters.push(clusters[first]);
            }
        }
        for (let k = 0; k < clusters.length; k++)
            if (!clusters[k].centre.used)
                newClusters.push(clusters[k]);
        for (let i = 0; i < newClusters.length; i++)
            newClusters[i].centre.used = false;
        clusters = newClusters;
    }
    control.draw(clusters, ctx_Hierarchical);
}
function DBSCAN() {
    let nearestPoints = new Array(control.points.length);
    let statuses = new Array(control.points.length);
    let clusters = [];
    for (let i = 0; i < nearestPoints.length; i++)
        nearestPoints[i] = [];
    for (let i = 0; i < control.points.length; i++) {
        for (let j = 0; j < control.points.length; j++) {
            if (i !== j) {
                let distance = Math.sqrt((control.points[i].x - control.points[j].x) ** 2 + (control.points[i].y - control.points[j].y) ** 2);
                if (distance <= epsilon) {
                    nearestPoints[i].push(j);
                }
            }
        }
    }
    for (let i = 0; i < nearestPoints.length; i++) {
        if (statuses[i] === undefined) {
            if (nearestPoints[i].length + 1 < minPts) {
                statuses[i] = 'noise';
            }
            else {
                statuses[i] = 'core';
                let cluster = new Cluster(control.points[i]);
                for (let j = 0; j < nearestPoints[i].length; j++) {
                    if (statuses[nearestPoints[i][j]] === undefined)
                        statusDetermination(nearestPoints[i][j], nearestPoints, statuses, cluster);
                }
                clusters.push(cluster);
            }
        }
    }
    for (let i = 0; i < nearestPoints.length; i++) {
        if (statuses[i] === 'noise') {
            let cluster = new Cluster(control.points[i]);
            cluster.color = '#fff';
            clusters.push(cluster);
        }
    }
    control.draw(clusters, ctx_DBSCAN);
}
function statusDetermination(index, nearestPoints, statuses, cluster) {
    if (nearestPoints[index].length + 1 >= minPts) {
        statuses[index] = 'core';
        for (let i = 0; i < nearestPoints[index].length; i++)
            if (statuses[nearestPoints[index][i]] === undefined)
                statusDetermination(nearestPoints[index][i], nearestPoints, statuses, cluster);
    }
    else {
        statuses[index] = 'border';
    }
    cluster.points.push(control.points[index]);
}
export function runAlgorithm() {
    numberOfClusters = parseInt(inputNumberOfClusters.value);
    if (numberOfClusters < 1 || inputNumberOfClusters.valueAsNumber !== Math.floor(numberOfClusters) || numberOfClusters > control.points.length) {
        notValidNumberToast.show();
        return;
    }
    minPts = parseInt(minPtsInput.value);
    if (minPts < 1 || minPtsInput.valueAsNumber !== Math.floor(minPts) || minPts > control.points.length) {
        notValidMinPts.show();
        return;
    }
    epsilon = parseInt(epsilonInput.value);
    if (epsilon < 0) {
        notValidEpsilon.show();
        return;
    }
    K_means();
    C_means();
    AgglomerativeHierarchicalClustering();
    DBSCAN();
}
//# sourceMappingURL=algorithms.js.map