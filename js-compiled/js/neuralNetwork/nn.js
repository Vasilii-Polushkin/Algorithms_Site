export class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = 0.0;
            }
        }
    }
    static multiply(a, b) {
        if (b.rows !== a.cols) {
            console.log('cols of A must match rows of B');
            return undefined;
        }
        let result = new Matrix(a.rows, b.cols);
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                let sum = 0;
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }
        return result;
    }
    multiply(x) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] *= x;
    }
    static elemMultiply(a, b) {
        let result = new Matrix(a.rows, 1);
        for (let i = 0; i < a.rows; i++)
            result.data[i][0] = a.data[i][0] * b.data[i][0];
        return result;
    }
    addMatrix(x) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] += x.data[i][j];
    }
    add(x) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] += x;
    }
    static subtract(a, b) {
        let result = new Matrix(a.rows, b.cols);
        for (let i = 0; i < result.rows; i++)
            for (let j = 0; j < result.cols; j++)
                result.data[i][j] = a.data[i][j] - b.data[i][j];
        return result;
    }
    randomise() {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = Math.random() / 50;
    }
    static transpose(a) {
        let result = new Matrix(a.cols, a.rows);
        for (let i = 0; i < a.rows; i++)
            for (let j = 0; j < a.cols; j++)
                result.data[j][i] = a.data[i][j];
        return result;
    }
    map(func) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                let value = this.data[i][j];
                this.data[i][j] = func(value);
            }
    }
    static map(matrix, func) {
        let result = new Matrix(matrix.rows, matrix.cols);
        for (let i = 0; i < matrix.rows; i++)
            for (let j = 0; j < matrix.cols; j++) {
                let value = matrix.data[i][j];
                result.data[i][j] = func(value);
            }
        return result;
    }
    static toMatrix(arr) {
        let m = new Matrix(arr.length, 1);
        for (let i = 0; i < m.rows; i++)
            m.data[i][0] = arr[i];
        return m;
    }
    static softmax(x) {
        let result = new Matrix(x.rows, 1);
        let sum = 0.0;
        for (let i = 0; i < result.rows; i++) {
            let temp = x.data[i][0];
            result.data[i][0] = Math.exp(temp);
            sum += result.data[i][0];
        }
        for (let i = 0; i < result.rows; i++) {
            result.data[i][0] /= sum;
        }
        return result;
    }
}
export class Pair {
    input = new Matrix(784, 1);
    desired_output = new Matrix(10, 1);
    constructor(input, desired_output) {
        this.input = input;
        this.desired_output = desired_output;
    }
}
export class Network {
    weights = [];
    biases = [];
    constructor(sizes) {
        this.layers_number = sizes.length;
        this.sizes = sizes;
        // Создание матрицы весов для каждых двух соседних слоев
        // и заполнение рандомными значениями от 0 до 1
        for (let l = 0; l < this.layers_number - 1; l++) {
            this.weights[l] = new Matrix(this.sizes[l + 1], this.sizes[l]);
            this.weights[l].randomise();
        }
        // Инициализация векторов сдвигов нулями
        for (let l = 0; l < this.layers_number; l++)
            this.biases[l] = new Matrix(this.sizes[l], 1);
    }
}
function sigmoid(x) {
    return 1.0 / (1.0 + Math.exp(-x));
}
function sigmoidDerivative(y) {
    return y * (1 - y);
}
export function feedForward(network, activations) {
    // sigmoid
    for (let l = 1; l < network.layers_number - 1; l++) {
        let temp = Matrix.multiply(network.weights[l - 1], activations[l - 1]);
        activations[l].addMatrix(temp);
        activations[l].addMatrix(network.biases[l]);
        activations[l].map(sigmoid);
    }
    // softmax
    let temp = Matrix.multiply(network.weights[network.layers_number - 2], activations[network.layers_number - 2]);
    activations[network.layers_number - 1].addMatrix(temp);
    activations[network.layers_number - 1].addMatrix(network.biases[network.layers_number - 1]);
    activations[network.layers_number - 1] = Matrix.softmax(activations[network.layers_number - 1]);
    return activations;
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
function backpropagation(x, y, delta_nabla_biases, delta_nabla_weights, network, lr) {
    let temp = network.weights[network.layers_number - 2];
    let tempBiases = network.biases[network.layers_number - 1];
    // Создание массива векторов активаций
    let activations = new Array(network.sizes.length);
    for (let i = 0; i < activations.length; i++)
        activations[i] = new Matrix(network.sizes[i], 1);
    activations[0] = x;
    // Заполнение массива активаций нейронов
    let outputs = feedForward(network, activations);
    // Нахождение градиента для весов и сдвигов
    let gradients = Matrix.subtract(outputs[network.layers_number - 1], y);
    for (let l = network.layers_number - 1; l > 0; l--) {
        let activation_gradients = Matrix.multiply(Matrix.transpose(gradients), temp);
        activation_gradients = Matrix.transpose(activation_gradients);
        delta_nabla_weights[l - 1] = Matrix.multiply(outputs[l - 1], Matrix.transpose(gradients));
        delta_nabla_weights[l - 1] = Matrix.transpose(delta_nabla_weights[l - 1]);
        delta_nabla_biases[l] = gradients;
        gradients = Matrix.elemMultiply(activation_gradients, Matrix.map(outputs[l - 1], sigmoidDerivative));
        if (l - 2 >= 0)
            temp = network.weights[l - 2];
    }
}
function update(batch, network, lr) {
    let nabla_biases = new Array(network.layers_number);
    for (let l = 1; l < nabla_biases.length; l++)
        nabla_biases[l] = new Matrix(network.sizes[l], 1);
    let nabla_weights = new Array(network.layers_number - 1);
    for (let l = 0; l < nabla_weights.length; l++)
        nabla_weights[l] = new Matrix(network.sizes[l + 1], network.sizes[l]);
    for (let i = 0; i < batch.length; i++) {
        let x = batch[i].input;
        let y = batch[i].desired_output;
        let delta_nabla_biases = new Array(network.layers_number);
        for (let l = 0; l < delta_nabla_biases.length; l++)
            delta_nabla_biases[l] = new Matrix(network.sizes[l], 1);
        let delta_nabla_weights = new Array(network.layers_number - 1);
        for (let l = 0; l < delta_nabla_weights.length; l++)
            delta_nabla_weights[l] = new Matrix(network.sizes[l + 1], network.sizes[l]);
        backpropagation(x, y, delta_nabla_biases, delta_nabla_weights, network, lr);
        // Изменение основного массива градиентов
        for (let l = 1; l < nabla_biases.length; l++)
            nabla_biases[l].addMatrix(delta_nabla_biases[l]);
        for (let l = 0; l < nabla_weights.length; l++)
            nabla_weights[l].addMatrix(delta_nabla_weights[l]);
    }
    for (let l = 0; l < network.weights.length; l++) {
        nabla_weights[l].multiply(lr / batch.length);
        network.weights[l] = Matrix.subtract(network.weights[l], nabla_weights[l]);
    }
    for (let l = 1; l < network.biases.length; l++) {
        nabla_biases[l].multiply(lr / batch.length);
        network.biases[l] = Matrix.subtract(network.biases[l], nabla_biases[l]);
    }
}
export function stochasticGradientDescent(trainingData, epochs, batchSize, lr) {
    let network = new Network([784, 200, 10]);
    for (let i = 0; i < epochs; i++) {
        trainingData = shuffle(trainingData);
        // Инциализация массива сетов данных
        // Элемент отдельного batch'a представляет собой пару значений (x, y),
        // где х - изображение, а у - ожидаемый результат
        let batches = Array.from(Array(trainingData.length / batchSize), () => new Array(batchSize));
        for (let j = 0; j < trainingData.length; j += batchSize)
            for (let k = 0; k < batchSize; k++)
                batches[j / batchSize][k] = trainingData[j + k];
        for (let j = 0; j < batches.length; j++)
            update(batches[j], network, lr);
    }
    return network;
}
//# sourceMappingURL=nn.js.map