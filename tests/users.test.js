const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is one user initially', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password123', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('new user can be added with a new username', async () => {
    const users = await helper.usersInDb()

    const newUser = {
      username: 'evakristinat',
      name: 'Eeva Takanen',
      password: 'password321',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(users.length + 1)

    const usernames = usersAfter.map((user) => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('new user cannot be added if username is taken', async () => {
    const users = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Anonymous',
      password: 'pass',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(users.length)
  })

  test('new user without password will not be added', async () => {
    const users = await helper.usersInDb()

    const newUser = {
      username: 'Noname',
      name: 'Hello',
      password: '',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password required')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(users.length)
  })

  test('new user with unacceptable username will not be added', async () => {
    const users = await helper.usersInDb()

    const newUser = {
      username: 'N',
      name: 'No Name',
      password: 'badpassword',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must have 3')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(users.length)
  })

  test('new user with unacceptable name will not be added', async () => {
    const users = await helper.usersInDb()

    const newUser = {
      username: 'name',
      name: 0,
      password: 'secret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('name')
    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(users.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
