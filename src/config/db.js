import { mongoose } from "mongoose";

export const connectDb = async (uri, namedb)=>{
    try {
        const db = await mongoose.connect(uri, {
            dbName: namedb,
           
        });

        return console.log(`DB is connected to ${db.connection.name}`);
    } catch (error) {
        console.log(error);
    }
}