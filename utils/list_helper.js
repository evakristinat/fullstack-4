const { error } = require('./logger')

const dummy = (blogs) => {
  return Array.isArray(blogs) ? 1 : error('the parameter needs to be an array')
}

const totalLikes = (blogs) => {
  return Array.isArray(blogs)
    ? blogs.reduce((sum, item) => {
        return sum + item.likes
      }, 0)
    : error('the parameter needs to be an array')
}

module.exports = { dummy, totalLikes }
