const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDb = require('./config/config')
dotenv.config()
const parentRoute = require('./routes/parentRoute')
const teacherRoute = require('./routes/teacherRoute')
const cors = require('cors')

// DB CONNECTION
connectDb()

// MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))



// ROUTE HERE
app.use('/api/v1', parentRoute)
app.use('/api/v1', teacherRoute)

// DEFAULT ROUTE MIDDLEWARE
app.use('*', (req, res, next) => {
    res.status(404).json({
        data: {
            status: 'fail',
            message: `Oops... seems like the route ${req.originalUrl} You're looking for does not exist`
        }
    })
    next()
})


// main branch

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})