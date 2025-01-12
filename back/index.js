console.log("en marcha")
const express=require("express")
const connectDB = require("./src/config/db")
const indexRouter = require("./src/api/routes/indexRouter")
require("dotenv").config()
const app=express()
app.use(express.json())
connectDB()
const PORT=6001
app.listen(PORT,()=>{console.log(`listen in http://localhost:${PORT}`)})
app.use("/v1/api",indexRouter)
app.use("*",(req,res,next)=>{
    res.status(404).json("I don't have this route, try again")
})

