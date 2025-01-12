
const userRouter = require("./user")
const authRouter=require("./authRouter")

const indexRouter=require("express").Router()
indexRouter.use("/users",userRouter)
indexRouter.use("/auth",authRouter)


module.exports=indexRouter