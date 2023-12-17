const mongoose = require('mongoose')
require("dotenv").config();

async function connectToMongoDB(){
    const URI = process.env.MONGODB_URI || ""
    try {
        await mongoose.connect(URI)
        console.log("Database Connected");
    } catch (error) {
        console.error(error)
    }
}

module.exports = {connectToMongoDB}