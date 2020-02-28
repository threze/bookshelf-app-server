const axios = require('axios')
const apiKey = '54bc8a90b9ec3f31addef0c092d7c22e'
const getBookImage = async(name) => {
  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${name}&page=1&include_adult=false`
    const res = await axios.get(url)
    return {
      poster: `//image.tmdb.org/t/p/original${res.data.results[0].poster_path}`,
      background: `//image.tmdb.org/t/p/original${res.data.results[0].backdrop_path}`
    }
  } catch (err) {
  }
  return { poster: '', background: '' }
}

const get = ({ db }) => async(req, res) => {
  if (req.params.genre) {
    const books = await db
      .select({
        id: 'books.id',
        name: 'books.name',
        status: 'books.status',
        genre: 'genres.name',
        poster: 'books.poster',
        background: 'books.background'
      })
      .from('books')
      .leftJoin('genres', 'genres.id', 'books.genre_id')
    res.send({
      data: books,
      pagination: {
        message: 'soon :)'
      }
    })
  } else {
    const books = await db
      .select({
        id: 'books.id',
        name: 'books.name',
        status: 'books.status',
        genre: 'genres.name',
        poster: 'books.poster',
        background: 'books.background'
      })
      .from('books')
      .leftJoin('genres', 'genres.id', 'books.genre_id')
    res.send({
      data: books,
      pagination: {
        message: 'soon :)'
      }
    })
  }
}

const create = ({ db }) => async(req, res) => {
  const newBook = req.body

  const images = await getBookImage(newBook.name)

  const bookToInsert = {
    name: newBook.name,
    status: newBook.status,
    genre_id: newBook.genre_id,
    comments: newBook.comments,
    poster: images.poster,
    background: images.background
  }

  const [insertedId] = await db.insert(bookToInsert).into('books')
  bookToInsert.id = insertedId
  res.send(bookToInsert)
}

const getOne = ({ db }) => async(req, res) => {
  let id = req.params.id
  const book = await db('books')
    .select({
      id: 'books.id',
      name: 'books.name',
      status: 'books.status',
      genre: 'genres.name',
      genre_id: 'books.genre_id',
      comments: 'books.comments',
      poster: 'books.poster',
      background: 'books.background'
    })
    .where('books.id', id)
    .leftJoin('genres', 'genres.id', 'books.genre_id')
    .first()
  res.send(book)
}

const remove = ({ db }) => async(req, res) => {
  const { id } = req.params
  const book = await db('books').select().where('id', id)
  if (book.length === 0) {
    res.status(401)
    res.send({ error: true })
  } else {
    await db('books').select().where('id', id).del()
    res.send({ success: true })
  }
}

const update = ({ db }) => async(req, res) => {
  const updatedBook = req.body
  let { id } = req.params

  const book = await db('books').select().where('id', id)
  if (book.length === 0) {
    res.status(401)
    return res.send({ error: true })
  }

  const images = await getBookImage(updatedBook.name)

  const bookToUpdate = {
    name: updatedBook.name,
    status: updatedBook.status,
    genre_id: updatedBook.genre_id,
    comments: updatedBook.comments,
    poster: images.poster,
    background: images.background
  }

  await db('books')
    .where('id', id)
    .update(bookToUpdate)

  res.send(bookToUpdate)
}

module.exports = { get, getOne, remove, create, update }
