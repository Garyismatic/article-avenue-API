const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const topics = require('../db/data/test-data/topics')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('/api', () => {
    describe('GET', () => {
        it('responds with an object containing a list of the available endpoints', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body).toEqual({endpoints})
            })
        })
    })
})
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
describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        it('returns an article corresponding to the article id given', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({body}) => {
                expect(body).toEqual({ article:
                    {
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      votes: 0
                  }
                })
            })
        })
        describe('error handling for get /api/articles/article_id', () => {
            it('responds with 404 status if article id does not exist', () => {
                return request(app)
                .get('/api/articles/9001')
                .expect(404)
                .then(({body: { message }}) => {
                    expect(message).toBe('not found')
                })
            })
        })
    })
})