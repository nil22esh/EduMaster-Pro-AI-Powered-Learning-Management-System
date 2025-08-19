import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGO_URI;
const dbConnect = async () => {
  try {
    await mongoose
      .connect(mongoUri)
      .then(() => {
        console.log(`Database Connected: ${mongoUri}`);
      })
      .catch((error) => {
        console.log(`Error while connecting database: ${error.message}`);
      });
  } catch (error) {
    console.log(`Error while connecting database: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
