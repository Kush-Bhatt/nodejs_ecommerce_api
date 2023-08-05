import mongoose from "mongoose";

const dbConnect = async () => {
    try{
        const connected = await mongoose.connect(process.env.CONNECTION_STRING,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'nodejs-ecommerce-api'
        });
        console.log(`MongoDb Connected: ${connected.connection.host}`);
    }
    catch(error){
        console.log(`Error : ${error.message}`);
        process.exit(1);
    }
};

export default dbConnect;