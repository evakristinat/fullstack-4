const express = require('express')
const app = express()
const blogRouter = require('./controllers/blogs')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) =>
    logger.error('error in MongoDB connection', error.message)
  )

app.use(cors())

app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app