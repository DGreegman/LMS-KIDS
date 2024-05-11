const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.iec4oco.mongodb.net/Learning_Kids`

const connectDb = async () => {
    try {
        await mongoose.connect(CONNECTION_STRING)
            .then(connect => console.log("Database Connected", connect.connection.name, connect.connection.host))

    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = connectDb