const Teacher = require('../models/teacherModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class TeacherController {
    async register(req, res) {
        try {
            const { email, password, confirm_password } = req.body

            if (!email || !password || !confirm_password) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'All Fields are Required...'
                })
            }
            // checking if a teacher with the email provided exists
            const teacherExists = await Teacher.findOne({ email })

            if (teacherExists) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Sorry but a teacher with this email already exists'
                })
            }

            // hashing the password before saving to the database
            const hashPassword = bcrypt.hashSync(password, 7)
            const teacher = new Teacher({ email, password: hashPassword })
            await teacher.save()

            res.status(201).json({
                status: 'Success',
                message: 'teacher Created Successfully...'
            })


        } catch (e) {
            res.status(500).json({
                status: 'Error',
                message: 'An Error Occurred...'
            })
        }
    }

    // login a user and implement jwt

    async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    status: 'Fail',
                    message: "Email and Password FIled are Required, Kindly Provide them..."
                })
            }

            // check if the users email exist in the database
            const user = await Teacher.findOne({ email })
            // console.log(user.email)
            if (!user) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Teacher with this email does not exist'
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
}

module.exports = TeacherController