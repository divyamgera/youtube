import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const database = async (req, res) => {
  try {
    const data = await mongoose.connect(process.env.DBURL);
    console.log("Database Connected Successsfully", data.connection.host);
  } catch (error) {
    console.log(error, "DB- ERROR");
  }
};

export default database;




