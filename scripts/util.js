/**
* Generate an array of random numbers
* @param {number} number - How many numbers to generate
* @param {number} max - Upper bound for numbers to be generated (lower is 0)
*/
let randomIntegers = (number, max) => {
   let list = []
   for (let i = 0; i < number; i++) {
       list.push(Math.round(Math.random() * max))
   }
   return list
}

module.exports = {
    randomPoints: (number, max) => {
        let xValues = randomIntegers(number, max)
        let yValues = randomIntegers(number, max)
        return xValues.map((val, i) => { 
            return {
                x: val,
                y: yValues[i]
            }
        })
    },
    pointsAroundFunction: (func, max, scatterRange) => {
        let list = []
        for (let i = 0; i < max; i++) {
            let functionValue = func(i)
            let variation = (Math.random() * scatterRange * 2) - scatterRange
            list.push({
                x: i,
                y: functionValue + variation
            })
        }
        return list
    },
    arraySum: array => array.reduce((a,b) => a + b, 0),
    arrayMean: array => array.reduce((a,b) => a + b, 0) / array.length,
    precisionRound: (value, precision) => {
        let factor = Math.pow(10, precision)
        return Math.round(value * factor) / factor
    } 
}