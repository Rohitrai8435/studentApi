const mongoose=require('mongoose');
exports.connectionDatabase=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("database Connected Successfully")
    } catch (error) {
        console.log(error.message)
    }
}