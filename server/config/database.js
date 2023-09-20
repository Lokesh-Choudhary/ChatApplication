const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL,{ 
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        console.log(`MongoDB Connected to ${conn.connection.host} Successfully `);
        
    } catch (error) {
        console.log(`MongoDB Connect Error : ${error.message}`); 
        process.exit();
    }
}

module.exports = connectDB;