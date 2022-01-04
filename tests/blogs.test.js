const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const app = require('../app')

//superagent-olio, joka mahdollistaa pyynnöt backendiin
const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('with get', () => {
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
      expect(blog.id).toBeDefined()
    })
  })
})

describe('with post', () => {
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

  test('new blog must have title and url', async () => {
    const newBlog = {
      title: '',
      author: 'The tester herself',
      url: '',
      likes: 150,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
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
})

describe('with delete', () => {
  test('a blog can be deleted', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1)

    const blogTitles = blogsAfter.map((blog) => blog.title)
    expect(blogTitles).not.toContainEqual(blogToDelete.title)
  })
})

describe('with put', () => {
  test('a blog can be updated', async () => {
    const blogs = await helper.blogsInDb()
    const blogToUpdate = blogs[0]
    const newBlog = {
      title: 'Testing',
      author: 'The tester herself',
      url: 'https://en.wikipedia.org/wiki/Software_testing',
      likes: 150,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    expect(response.body.title).toEqual('Testing')

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter[0].likes).toEqual(newBlog.likes)
  })
})



afterAll(() => {
  mongoose.connection.close()
})
