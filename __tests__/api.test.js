const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const topics = require('../db/data/test-data/topics')
const endpoints = require('../endpoints.json')
const { checkCommentExists } = require('../utils/utils')

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
        it('returns an array of all articles from the db', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(13)
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
                expect(message).toBe('invalid request')
            })
        })  
    })
    describe('PATCH', () => {
        it('updates the votes count on an article selected by its corresponding article_id', () => {
            return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: 5})
            .expect(200)
            .then(({body: {updatedArticle}}) => {
                expect(updatedArticle).toEqual( {
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      votes: 5
                  })
            })
        })
        it('increments the votes count on an article selected by its corresponding article_id and doesnt just replace the value', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 5})
            .expect(200)
            .then(({body: {updatedArticle}}) => {
                expect(updatedArticle).toEqual( {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 105,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  })
            })
        })
        it('decreases the vote count when given a negative number', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -10})
            .expect(200)
            .then(({body: {updatedArticle}}) => {
                expect(updatedArticle).toEqual( {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 90,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  })
            })
        })
        it('responds back with 400 error if votes is not a number', () => {
            return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: 'not-a-number'})
            .expect(400)
            .then(({body: {message}}) => {
                expect(message).toBe('invalid request')
            })
        })
        it('responds with 400 invalid request if article id is not a number', () => {
            return request(app)
            .patch('/api/articles/not-a-number-now')
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({body: {message}}) => {
                expect(message).toBe('invalid request')
            })
        })
        it('responds with 404 not found if article id does not exist', () => {
            return request(app)
            .patch('/api/articles/3421')
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({body: {message}}) => {
                expect(message).toBe('not found')
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
                        article_id: 1
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
                expect(message).toBe('invalid request')
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
    describe('POST', () => {
        it('targets an article by its id and adds a comment to it', () => {
            const comment = {
                username: 'butter_bridge',
                body: 'This is my random comment'
            }
            return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(201)
            .then(({body: {commentPosted}}) => {
                expect(commentPosted).toBe('This is my random comment')
            })
        })
        it('returns an error if passed an empty comment', () => {
            const comment = {
                username: 'butter_bridge',
                body: ''
            }
            return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(400)
            .then(({body: {message}}) => {
                expect(message).toBe('Comment body can not be empty')
            })
        })
        it('returns 404 not found if the article id does not exist', () => {
            const comment = {
                username: 'butter_bridge',
                body: 'OVER 9000 ARTICLES!!!!!!!!!'
            }
            return request(app)
            .post('/api/articles/9001/comments')
            .send(comment)
            .expect(404)
            .then(({body: {message}}) => {
                expect(message).toBe('not found')
            })
        })
        it('returns 401 error unauthorised if username does not exist', () => {
            const comment = {
                username: 'not-a-user',
                body: 'How do I sign up?'
            }
            return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(401)
            .then(({body: {message}}) => {
                expect(message).toBe('unknown username')
            })
        })
        it('returns 400 invalid articleId if article id is not a number', () => {
            const comment = {
                username: 'rogersop',
                body: 'I love to comment on random things'
            }
            return request(app)
            .post('/api/articles/not-a-number/comments')
            .send(comment)
            .expect(400)
            .then(({body: {message}}) => {
                expect(message).toBe('invalid request')
            })
        })
    })
})
describe('/api/comments/:comment_id', () => {
    describe('DELETE', () => {
        it('returns a 204 status removing the comment selected by id from the database table', () => {
            return request(app)
            .delete('/api/comments/7')
            .expect(204)
            .then(() => {
                return checkCommentExists(7)
                .then((result) => {
                    expect(result).toBe(false)
                })
            })
        })
        it('returns a 404 not found if comment_id does not exist', () => {
            return request(app)
            .delete('/api/comments/999')
            .expect(404)
            .then(({body: {message}}) => {
                expect(message).toBe('not found')
            })
        })
        it('returns a 400 bad request if comment id is not a number', () => {
            return request(app)
            .delete('/api/comments/not-a-number')
            .expect(400)
            .then(({body: {message}}) => {
                expect(message).toBe('invalid request')
            })
        })
    })
})
describe('/api/users', () => {
    describe('GET', () => {
        it('returns an array of all of the users', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body: {users}}) => {
                expect(users.length).toBe(4)
                users.forEach((user) => {
                    expect(user).toEqual({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        })
    })
})
describe('GET /api/articles (sorting queries)', () => {
    describe('sort_by', () => {
        it('serves an array of articles sorted by their ID number', () => {
            return request(app)
            .get('/api/articles?sort_by=article_id')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles).toBeSortedBy('article_id')
            })
        })
    })
})