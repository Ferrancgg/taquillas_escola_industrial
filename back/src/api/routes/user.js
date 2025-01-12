const { createUser, getUser, login } = require("../controller/user")

const userRouter=require("express").Router()

userRouter.post("/create",createUser)
userRouter.get("/:id",getUser)



module.exports=userRouter