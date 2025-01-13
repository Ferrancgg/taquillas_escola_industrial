
const userRouter = require("./user")
const authRouter=require("./authRouter")
const lockerRouter = require("./locker")

const indexRouter=require("express").Router()
indexRouter.use("/users",userRouter)
indexRouter.use("/auth",authRouter)
indexRouter.use("/locker",lockerRouter)



module.exports=indexRouter