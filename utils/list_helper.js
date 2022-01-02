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

//Blogit sortataan kasvavassa järjestyksessä ja viimeinen, eli suurin, palautetaan.
const favoriteBlog = (blogs) => {
  if (Array.isArray(blogs)) {
    const blogsToSort = [...blogs]
    const sortedBlogs = blogsToSort.sort((a, b) => a.likes - b.likes)
    const favorite = sortedBlogs.pop()
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    }
  } else {
    error('the parameter needs to be an array')
  }
}

const mostBlogs = (blogs) => {
  if (Array.isArray(blogs) && blogs.length > 1) {
    const authors = blogs.map((blog) => blog.author)
    const countAuthors = (allAuthors, searchedAuthor) =>
      allAuthors.reduce((amount, author) => {
        return author === searchedAuthor ? amount + 1 : amount
      }, 0)

    let all = []

    const uniqueAuthors = [...new Set(authors)]

    for (const author of uniqueAuthors) {
      const amount = countAuthors(authors, author)
      all.push({
        author: author,
        blogs: amount,
      })
    }

    const sorted = all.sort((a, b) => a.blogs - b.blogs)
    return sorted.pop()
  } else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1,
    }
  } else {
    error('the parameter needs to be an array with one or more blogs')
  }
}

const mostLikes = (blogs) => {
  if (Array.isArray(blogs) && blogs.length > 1) {
    const authors = blogs.map((blog) => blog.author)
    let all = []

    const countLikes = (allBlogs, searchedAuthor) =>
      allBlogs.reduce((likes, blog) => {
        return blog.author === searchedAuthor ? likes + blog.likes : likes
      }, 0)

    const uniqueAuthors = [...new Set(authors)]

    for (const author of uniqueAuthors) {
      const likes = countLikes(blogs, author)
      all.push({
        author: author,
        likes: likes,
      })
    }

    const sorted = all.sort((a, b) => a.likes - b.likes)
    return sorted.pop()
  } else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes,
    }
  } else {
    error('the parameter needs to be an array with one or more blogs')
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
