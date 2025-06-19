import mongoose from "mongoose";
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'; 

async function connectToDatabase() {
    try {
        await mongoose.connect(uri, {
        });
        console.log("Mongoose connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB with Mongoose:", error);
        process.exit(1); 
    }
}

export default connectToDatabase ;