const { error } = require('./logger')

const dummy = (blogs) => {
  if (Array.isArray(blogs)) {
    return 1
  } else {
    error('the parameter needs to be an array')
  }
}

module.exports = { dummy }
