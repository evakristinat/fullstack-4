const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error in MongoDB connection', error.message))

app.use(cors())

app.use(express.json())

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
