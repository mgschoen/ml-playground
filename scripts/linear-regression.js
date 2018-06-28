const Util = require('./util')
const CliGraph = require('cli-graph')
require('colors')

function logCalculations (meanX, meanY, errorsX, errorsY, numerator, denominator, b1, b0) {
    console.log()
    console.log('Calculations:'.black.bold)
    console.log('meanX: '.bold + meanX)
    console.log('meanY: '.bold + meanY)
    console.log('errorsX: '.bold + errorsX)
    console.log('errorsY: '.bold + errorsY)
    console.log('numerator: '.bold + numerator)
    console.log('denominator: '.bold + denominator)
    console.log('b1: '.bold + b1)
    console.log('b0: '.bold + b0)
    console.log()
}
 /**
  * Calculate a simple linear regression function out of a list of points.
  * @param {Array} trainingPoints - List of points the function should approximate
  * @returns {Function} - approximation function
  */
function calcRegressionFunc (trainingPoints) {
    let xValues = trainingPoints.map(point => point.x)
    let yValues = trainingPoints.map(point => point.y)
    let meanX = Util.arrayMean(xValues)
    let meanY = Util.arrayMean(yValues)
    // b1 = sum((x_i-mean(x)) * (y_i-mean(y))) / sum((x_i – mean(x))^2)
    let errorsX = xValues.map(value => Math.round((value - meanX) * 100) / 100)
    let errorsY = yValues.map(value => Math.round((value - meanY) * 100) / 100)
    let numerator = Util.arraySum(errorsX.map((value, index) => value * errorsY[index]))
    let denominator = Util.arraySum(errorsX.map(value => Math.pow(value, 2)))
    let b1 = numerator / denominator
    // b0 = mean(y) - b1 * mean(x)
    let b0 = meanY - b1 * meanX
    logCalculations(meanX, meanY, errorsX, errorsY, numerator, denominator, b1, b0)
    return x => b0 + b1 * x
}

// Generate training data
let intercept = Math.random() * 30
let slope = Math.random() * 5 - 2.5
console.log()
console.log('Training function: '.bold.black +  `f(x) = ${intercept} + ${slope} * x`)
let trainingData = Util.pointsAroundFunction(x => intercept + slope * x, 50, 5)

// Training data from tutorial 
// https://machinelearningmastery.com/simple-linear-regression-tutorial-for-machine-learning/
/*let trainingData = [
    {x: 1, y: 1},
    {x: 2, y: 3},
    {x: 4, y: 3},
    {x: 3, y: 2},
    {x: 5, y: 5}
]*/

// Plot training data
let graphConfig = {
    width: 50,
    height: 50,
    center: { x: 0, y: 49 }
}
let plotFunction = new CliGraph(graphConfig)

for (point of trainingData) {
    plotFunction.addPoint(point.x, point.y, 'x')
}

let regression = calcRegressionFunc(trainingData)
let predictions = trainingData.map(point => regression(point.x))
let squaredErrors = predictions.map((p, i) => Math.pow(p - trainingData[i].y, 2))
let rmse = Math.sqrt(Util.arraySum(squaredErrors) / trainingData.length)

// Plot regression line
plotFunction.setFunctionX(regression)
console.log()
console.log('Plotted training data:'.bold.black)
console.log(plotFunction.toString())
console.log()
console.log('Root Mean Squared Error: '.bold + rmse)
console.log()