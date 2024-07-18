const app = require('./app')
const { port = 9001 } = process.env

app.listen(port, () => {
    console.log(`listening on ${port}...`)
})