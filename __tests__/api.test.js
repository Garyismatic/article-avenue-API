const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const topics = require('../db/data/test-data/topics')

beforeAll(() => seed(data))
afterAll(() => db.end())

describe('/api/topics', () => {
    describe('GET', () => {
        it('responds with an array of objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body).toEqual({topics})
            })
        })
    })
})