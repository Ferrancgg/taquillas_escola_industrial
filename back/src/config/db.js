const mongoose = require("mongoose");
const setError = require("./error");

const connectDB = async() => {
  try { 
    await mongoose.connect(process.env.DB_URL)
    console.log("connection to dataBase is OK")
    

  } catch (error) {
    console.error("error to BD connect", error);
    return setError(500, "error in connection to dataBase ");
  }
};
module.exports = connectDB;
