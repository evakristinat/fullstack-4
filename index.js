const http = require('http')
const express = require('express')
const app = require('./app')
const cors = require('cors')
const mongoose = require('mongoose')
const { info, error } = require('./utils/logger')
const { MONGO_URI, PORT } = require('./utils/config')

// const server = http.createServer(app)

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})
