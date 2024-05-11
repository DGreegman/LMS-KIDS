const Parent = require('../models/parentModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class ParentController {
    async register(req, res) {
        try {
            const { email, password, confirm_password } = req.body

            if (!email || !password || !confirm_password) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'All Fields are Required...'
                })
            }
            // checking if a parent with the email provided exists
            const parentExists = await Parent.findOne({ email })

            if (parentExists) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Sorry but a parent with this email already exists'
                })
            }

            // hashing the password before saving to the database
            const hashPassword = bcrypt.hashSync(password, 7)
            const parent = new Parent({ email, password: hashPassword })
            await parent.save()

            res.status(201).json({
                status: 'Success',
                message: 'Parent Created Successfully...'
            })


        } catch (e) {
            res.status(500).json({
                status: 'Error',
                message: 'An Error Occurred...'
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    status: 'Fail',
                    message: "Email and Password Filled are Required, Kindly Provide them..."
                })
            }

            // check if the users email exist in the database
            const user = await Parent.findOne({ email })
            // console.log(user.email)
            if (!user) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Parent with this email does not exist'
                })
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password)
            if (!isPasswordCorrect) {

                return res.status(400).json({
                    status: 'fail',
                    message: 'Email or Password is Incorrect'
                })
            }
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })

            res.status(200).json({
                status: 'success',
                token,
                data: {
                    message: "User Successfully Logged In..."
                }
            })
        } catch (error) {
            res.status(500).json({
                status: 'Error',
                message: error.message,
                // name: error.name,
                // stack: error.stack
            })
        }
    }
    async getAllUsers(req, res) {
        const parents = await Parent.find()
        if (!parents) {
            return res.status(404).json({
                status: 'fail',
                message: 'No Parent Found'
            })
        }
        res.status(200).json({
            status: 'Success',
            data: {
                parents
            }
        })
    }
}


module.exports = ParentController