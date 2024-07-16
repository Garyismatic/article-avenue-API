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
        it('includes all the correct keys from the JSON file', () => {
            const endpointKeys = Object.keys(endpoints)
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                const responseKeys = Object.keys(body.endpoints)
                expect(responseKeys).toEqual(endpointKeys)
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
describe('/api/articles', () => {
    describe('GET', () => {
        it('returns an array of articles from the db', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                articles.forEach((article) => {
                    expect(article).toEqual({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
        })
        it('returns all of the articles from the db', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(13)
            })
        })
        it('returns the articles sorted by date newly created first', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles).toBeSortedBy('created_at', {descending: true})
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
        it('responds with 404 status if article id does not exist', () => {
            return request(app)
            .get('/api/articles/9001')
            .expect(404)
            .then(({body: { message }}) => {
                expect(message).toBe('not found')
            })
        })
        it('responds with 400 status and "bad request" if id is not the expected data type', () => {
            return request(app)
            .get('/api/articles/not-a-number')
            .expect(400)
            .then(({body: {message}}) => {
                expect(message).toBe('Invalid datatype')
            })
        })  
    })
})
describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        it('returns an array of all comments linked to a specific article id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).toBe(11)
                comments.forEach((comment) => {
                    expect(comment).toEqual({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
                })
            })
        })
        it('returns comments ordered by date with newly created first', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toBeSortedBy('created_at', {
                    descending: true
                })
            })
        })
        it('returns an error 404 status when passed an article id that does not exist', () => {
            return request(app)
            .get('/api/articles/9001/comments')
            .expect(404)
            .then(({body: {message}}) => {
                expect(message).toBe('not found')
            })
        })
        it('returns the 400 status when passed an id that is an invalid data type', () => {
            return request(app)
            .get('/api/articles/not-a-number/comments')
            .expect(400)
            .then(({body: {message}}) => {
                expect(message).toBe('Invalid datatype')
            })
        })
        it('returns an empty array if the article id exists but there are no comments', () => {
            return request(app)
            .get('/api/articles/7/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toEqual([])
            })
        })
    })
})