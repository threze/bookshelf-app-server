const router = require('express').Router()

const books = require('./books')
const genres = require('./genres')

const api = require('express').Router()
api.get('/', (req, res) => res.send({
  info: 'Bookshelf APP Server',
  datetime: new Date()
}))
api.use('/books', books)
api.use('/genres', genres)

router.use('/api', api)

module.exports = router
