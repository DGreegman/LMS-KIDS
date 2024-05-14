const Parent = require('../models/parentModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../helpers/email')
const crypto = require('crypto')

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
            length: parents.length,
            data: {
                parents
            }
        })
    }


    // forget password method 
    async forget_password(req, res, next) {
        // getting parent based on the posted email
        const user = await Parent.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'Sorry.... We could not fine this email'
            })
        }


        // generate a random reset token, the function createPasswordToken is coming from parentModel file
        const reset_token = user.createPasswordToken()
        await user.save()

        // send the token generated back to the user
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${reset_token}`
        const message = `We have received a password reset request please use the below link to reset your password\n\n${resetUrl}\n\nThis reset Password will only be valid for 10mins\n\nKindly Ignore if you didn't Initiate this request`

        // using try catch just incase the email didn't deliver we will be able to capture the error
        try {
            await sendEmail({
                email: user.email,
                subject: `Password Change Request`,
                message: message
            })
            res.status(200).json({
                status: 'success',
                message: 'Password reset link sent to the user email'
            })
        } catch (error) {
            user.password_reset_token = undefined
            user.password_reset_token_expires = undefined
            user.save()

            res.status(500).json({
                status: 'fail',
                message: 'There was an Issue trying to send Password, Please Try again later...',
                // error: error.name,
                // errorMessage: error.message,
                // stackTrace: error.stack

            })

        }

    }

    // reset_password method that will be sent together with the token sent to the email
    async reset_password(req, res, next) {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
        const password = req.body.password
        const confirm_password = req.body.confirm_password

        const parent = await Parent.findOne({ password_reset_token: token, password_reset_token_expires: { $gt: Date.now() } })

        if (!parent) {
            return res.status(400).json({
                status: 'fail',
                message: 'Token is invalid or has expired...'
            })
        }

        if (!password || !confirm_password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Kindly, Provide password and Confirm Password'
            })
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Password Does not Match'
            })
        }
        parent.password = password
        parent.confirm_password = confirm_password
        parent.password_reset_token = undefined
        parent.password_reset_token_expires = undefined

        parent.save()

        const login_token = jwt.sign({ id: parent._id }, process.env.SECRET_KEY, { expiresIn: '1h' })

        res.status(200).json({
            status: 'success',
            login_token,
            data: {
                message: "Password changed Successfully..."
            }
        })

    }

    // async update_password(req, res, next) {

    //     // Get the password and confirm_password 
    //     const password = req.body.password.trim()
    //     const confirm_password = req.body.confirm_password.trim()

    //     if (!password || !confirm_password) {
    //         return res.status(400).json({
    //             status: 'fail',
    //             message: 'Both Field are Required to Continue...'
    //         })
    //     }

    //     if (password === confirm_password) {
    //         return res.status(400).json({
    //             status: 'fail',
    //             message: 'Password Does not Match...'
    //         })
    //     }
    //     const parent = Parent.findOneAndUpdate({ password })


    // }
}


module.exports = ParentController