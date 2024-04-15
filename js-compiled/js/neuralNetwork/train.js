import { Matrix, Pair, stochasticGradientDescent } from "./nn.js";
import mnist from 'mnist';
let set = mnist.set(60000, 10000);
let trainingSet = set.training;
let trainingData = new Array(trainingSet.length);
for (let i = 0; i < trainingData.length; i++) {
    let inputs = Matrix.toMatrix(trainingSet[i].input);
    let desired_outputs = Matrix.toMatrix(trainingSet[i].output);
    trainingData[i] = new Pair(inputs, desired_outputs);
}
let network = stochasticGradientDescent(trainingData, 30, 10, 0.1);
import fs from 'fs';
fs.writeFileSync('trainedNetwork.json', JSON.stringify(network));
//# sourceMappingURL=train.js.map