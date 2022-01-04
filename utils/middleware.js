const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    // 400 - Bad Request ja kuvaava viesti, kun muoto on väärä
    return res.status(400).send({ error: error.message })
    // tai validointi ei onnistu
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
    // tai Mongoosen validator heittää virheen
  } else if (error.name === 'MongoServerError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'TypeError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}
