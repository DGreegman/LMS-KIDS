const jwt = require('jsonwebtoken')
const util = require('util')
const Teacher = require('../models/teacherModel')

const validateToken = async (req, res, next) => {
    // Read the token to know if it exists
    const testToken = req.headers.authorization || req.headers.Authorization

    let token
    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1]
    }
    if (!token) {
        return next(res.status(401).json({
            status: 'fail',
            message: 'Sorry but it seems like you are not Logged in, Kindly Log in and Try again...'

        }))

    }
    // console.log(token)

    // validate the token 
    const decoded = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY)
    // console.log(decoded)

    // check if the user exist using the ID
    const user = await Teacher.findById(decoded.id)
    if (!user) {
        return next(
            res.status(401).json({
                status: 'fail',
                message: 'Sorry but it seems like the user with the given token does not exist...'

            })
        )
    }

    req.user = user
    next()
}

module.exports = validateToken