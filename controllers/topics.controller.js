const { fetchTopics } = require("../models/topics.model")

exports.getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
}