const app = require('./app')
require('./db')

const port = process.env.PORT || 3002

app
  .listen(port, () => {
    console.log('Bookshelf APP server running on port', port)
  })
  .on('error', err => {
    console.log('Error running Bookshelf APP server')
    console.log(err)
  })
