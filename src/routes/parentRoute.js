const router = require('express').Router()
const ParentController = require('../controllers/parentController')
const validate = require('../middlewares/validateUserInput')

const parent = new ParentController()

router.post('/parent-signup', validate, parent.register)
router.post('/parent-signin', parent.login)
router.get('/get-all', parent.getAllUsers)

module.exports = router