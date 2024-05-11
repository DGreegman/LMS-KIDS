const router = require('express').Router()
const TeacherController = require('../controllers/teacherController')
const teacher = new TeacherController()
const validate = require('../middlewares/validateUserInput')

router.post('/teacher-signup', validate, teacher.register)
router.post('/teacher-signin', teacher.login)

module.exports = router