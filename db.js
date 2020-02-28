const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite'
  },
  useNullAsDefault: true
})

const initDB = async () => {
  const booksExist = await knex.schema.hasTable('books')
  if (!booksExist) {
    await knex.schema.createTable('books', table => {
      table.increments('id').primary()
      table.string('name')
      table.string('status')
      table.integer('genre_id')
      table.string('comments')
      table.string('poster')
      table.string('background')
    })
  }
  const genresExist = await knex.schema.hasTable('genres')
  if (!genresExist) {
    await knex.schema.createTable('genres', table => {
      table.increments('id').primary()
      table.integer('name')
    })
  }

  const totalGenres = await knex('genres').select(knex.raw('count(*) as total'))
  if (totalGenres[0].total === 0) {
    await knex.insert({
      name: 'Ação'
    }).into('genres')

    await knex.insert({
      name: 'Comédia'
    }).into('genres')

    await knex.insert({
      name: 'Descubra o seu destino - Tiago Brunet',
      status: 'LIDO',
      genre_id: 1,
      comments: '',
      poster: '',
      background: ''
    }).into('books')
  }
}

initDB()

module.exports = knex
