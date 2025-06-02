import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connect MongoDB successfully!");
    })
    .catch((error) => {
      console.log("Failed to connect to MongoDB -> ", error);
    });
};

export default db;
