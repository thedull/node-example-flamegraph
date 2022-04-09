const levenshtein = require('fast-levenshtein')

const someFakeModule = (function someFakeModule () {
  return {
    calculateStringDistance (a, b) {
      //Here's where heavy sunchronous computation happens
      return levenshtein.get(a, b, {
        useCollator: true
      })
    }
  }
})()

module.exports = ({ text, randomText }) => {
    const message = someFakeModule.calculateStringDistance(text || '', randomText || '')
    return message
}
