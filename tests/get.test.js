const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

//superagent-olio, joka mahdollistaa pyynnöt backendiin
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id is displayed in correct form', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    console.log(blog.id)
    expect(blog.id).toBeDefined()
  })
})

test('posting a new blog is possible', async () => {
  const newBlog = {
    title: 'Testing',
    author: 'The tester herself',
    url: 'https://en.wikipedia.org/wiki/Software_testing',
    likes: 150,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAfter = await helper.blogsInDb()
  expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAfter.map((blog) => blog.title)
  expect(titles).toContainEqual('Testing')
})

test('likes are zero if not otherwise determined', async () => {
  const newBlog = {
    title: 'Testing',
    author: 'The tester herself',
    url: 'https://en.wikipedia.org/wiki/Software_testing',
  }

  const response = await api.post('/api/blogs').send(newBlog)
  expect(response.body.likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})
