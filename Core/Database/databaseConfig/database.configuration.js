import mongoose from "mongoose";
const { connect, connection } = mongoose;
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const con = await connect(process.env.MONGODB_URL);
      const isConntected = connection.readyState === 1;
      if (isConntected) {
        console.log(
          `MongoDB Database is connected Successfully and Database connection is active on :  ${con.connection.host}` // install colors for use this
        );
      } else {
        console.log("Database connection is not active");
      }
      isConnected = true;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      console.log("Retrying connection in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds delay
    }
  }
};
