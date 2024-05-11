const authSchema = require('../helpers/helper')

const validate = (req, res, next) => {
    const { error } = authSchema.validate(req.body)
    error ? res.status(400).json({ message: error.details[0].message }) : next()
}

module.exports = validate