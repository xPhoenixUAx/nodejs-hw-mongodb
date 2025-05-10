import mongoose from "mongoose";
import { getEnVar } from "../utils/getEnVar.js";

const dbHost = getEnVar("DB_HOST");
export const initMongoDB = async () => {
  try {
    await mongoose.connect(dbHost);
    console.log("Connection successfuly");
  } catch (error) {
    console.log(`Error connection Mongo ${error.message}`);
  }
};
