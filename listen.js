const app = require('./app')
const { PORT = 9001 } = process.env

app.listen(PORT, () => {
    console.log(`listening on ${PORT}...`)
})