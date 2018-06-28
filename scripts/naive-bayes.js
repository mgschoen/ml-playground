const cliff = require('cliff')
const colors = require('colors')

// Settings
const labels = {
    parapgraphType: {
        color: 'green',
        values: ['p', 'h1', 'h2', 'li']
    },
    POS: {
        color: 'red', 
        values: ['noun', 'noun-phrase', 'adj', 'adv', 'verb']
    },
    inSenctence: {
        color: 'blue', 
        values: ['first', 'last', 'between']
    },
    class: {
        color: 'magenta',
        values: ['keyword', 'no-keyword']
    }
}
const sampleSize = parseInt(process.argv.slice(2).shift()) || 20

// Generate sample
let sample = []
for (let i = 0; i < sampleSize; i++) {
    let row = {}
    for (let key in labels) {
        let values = labels[key].values
        let index = Math.floor(Math.random() * values.length)
        row[key] = values[index]
    }
    sample.push(row)
}

// Log sample
console.log()
console.log(`Sample data (sample size: ${sampleSize})`.bold.black)
cliff.putObjectRows('data', sample, Object.keys(labels), Object.keys(labels).map(key => labels[key].color))
console.log()

// Calculate probabilities
let classFrequencies = {}
let classProbabilities = {}
for (let className of labels.class.values) {
    let frequency = sample.filter(row => (row.class === className)).length
    classFrequencies[className] = frequency
    classProbabilities[className] = frequency / sample.length
}
let conditionalProbabilities = {}
for (let feature in labels) {
    if (feature !== 'class') {
        let values = labels[feature].values
        let probabilitesForFeature = {}
        for (let value of values) {
            let sampleForValue = sample.filter(row => (row[feature] === value))
            let probabilitiesForFeatureAndClass = {}
            for (let className of labels.class.values) {
                let sampleForValueAndClass = sampleForValue.filter(row => row.class === className)
                probabilitiesForFeatureAndClass[className] = sampleForValueAndClass.length / classFrequencies[className]
            }
            probabilitesForFeature[value] = probabilitiesForFeatureAndClass
        }
        conditionalProbabilities[feature] = probabilitesForFeature
    }
}

// Log probabilities
console.log(`Class Probabilities`.bold.black)
cliff.putObject(classProbabilities)
console.log()
console.log(`Conditional Probabilites`.bold.black)
cliff.putObject(conditionalProbabilities)

// Predict classes
for (let row of sample) {
    let decision = {}
    for (let className of labels.class.values) {
        let decisionValue = classProbabilities[className]
        let string = 'D('
        for (let feature in labels) {
            if (feature !== 'class') {
                let featureValue = row[feature]
                decisionValue = decisionValue * conditionalProbabilities[feature][featureValue][className]
                string += featureValue + '|'
            }
        }
        decision[className] = decisionValue
        string += className + ') = ' + decisionValue
        console.log(string)
    }
    let bestClass = {
        decisionValue: 0,
        label: ''
    }
    let decisionValuesSum = 0
    for (className in decision) {
        decisionValuesSum += decision[className]
        if (decision[className] > bestClass.decisionValue) {
            bestClass = {
                decisionValue: decision[className],
                label: className
            }
        }
    }
    row.predictedClass = bestClass.label
    row.probability = bestClass.decisionValue / decisionValuesSum
}

// Log predictions
console.log()
console.log('Sample with predictions'.bold.black)
cliff.putObjectRows('data', sample, 
    [...Object.keys(labels), 'predictedClass', 'probability'], 
    [...Object.keys(labels).map(key => labels[key].color), 'black', 'black'])

// Calculate precision
let wrongPredictions = sample.reduce((acc,row) => (row.class !== row.predictedClass) ? acc + 1 : acc, 0)
console.log()
console.log(`Wrong predictions: ${wrongPredictions}`)
console.log(`Precision: ${1 - wrongPredictions / sample.length}`)
console.log()
