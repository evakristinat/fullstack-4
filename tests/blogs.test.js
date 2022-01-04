const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

//superagent-olio, joka mahdollistaa pyynnöt backendiin
const api = supertest(app)

const createNewBlog = async () => {
  const res = await api
    .post('/api/login')
    .send({ username: 'Hello', password: 'password123' })

  const token = 'bearer ' + res.body.token

  const newBlog = {
    title: 'Testing',
    author: 'The tester herself',
    url: 'https://en.wikipedia.org/wiki/Software_testing',
    likes: 150,
  }
  await api.post('/api/blogs').set('Authorization', token).send(newBlog)

  const blog = await Blog.findOne({ title: 'Testing' })
  return blog.toJSON()
}

const passwordHash = await bcrypt.hash('password123', 10)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await new User({ username: 'Hello', passwordHash }).save()
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
    const res = await api
      .post('/api/login')
      .send({ username: 'Hello', password: 'password123' })

    const token = 'bearer ' + res.body.token

    const newBlog = {
      title: 'Testing',
      author: 'The tester herself',
      url: 'https://en.wikipedia.org/wiki/Software_testing',
      likes: 150,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAfter.map((blog) => blog.title)
    expect(titles).toContainEqual('Testing')
  })

  test('new blog must have title and url', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'Hello', password: 'password123' })

    const token = 'bearer ' + res.body.token
    const newBlog = {
      title: '',
      author: 'The tester herself',
      url: '',
      likes: 150,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400)
  })

  test('posting is not possible without a token', async () => {
    await api
      .post('/api/login')
      .send({ username: 'Hello', password: 'password123' })

    const newBlog = {
      title: 'Testing',
      author: 'The tester herself',
      url: 'https://en.wikipedia.org/wiki/Software_testing',
      likes: 150,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })


  test('likes are zero if not otherwise determined', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'Hello', password: 'password123' })

    const token = 'bearer ' + res.body.token

    const newBlog = {
      title: 'Testing',
      author: 'The tester herself',
      url: 'https://en.wikipedia.org/wiki/Software_testing',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', token)
    expect(response.body.likes).toBe(0)
  })
})

describe('with delete', () => {
  test('a blog can be deleted', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'Hello', password: 'password123' })

    const token = 'bearer ' + res.body.token

    const blogToDelete = await createNewBlog()
    const blogs = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(blogs.length - 1)

    const blogTitles = blogsAfter.map((blog) => blog.title)
    expect(blogTitles).not.toContainEqual(blogToDelete.title)
  })
})

describe('with patch', () => {
  test('a blogs likes can be updated', async () => {
    const blogToUpdate = await createNewBlog()

    const newLikes = {
      likes: 150,
    }

    const response = await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)
      .expect(200)

    expect(response.body.title).toEqual('Testing')

    const blogAfter = await Blog.findById(blogToUpdate.id)
    console.log(blogAfter.toJSON())
    console.log(response.body.likes)
    expect(blogAfter.toJSON().likes).toEqual(response.body.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
