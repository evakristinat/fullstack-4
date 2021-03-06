const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Jest has some issues',
    author: 'Anonymous',
    url: 'https://github.com/facebook/jest/issues/11665',
    likes: 8,
  },
  {
    title: 'Why sleep when you can code',
    author: 'Eeva',
    url: 'www.fullstackopen.com',
    likes: 680,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,

}
