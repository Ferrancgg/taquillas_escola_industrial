const { createUser, getUser, login, getAllUsers, updateUser } = require("../controller/user")

const userRouter=require("express").Router()

userRouter.post("/create",createUser)
userRouter.get("/:id",getUser)
userRouter.get("/",getAllUsers)
userRouter.post("/:id",updateUser)



module.exports=userRouter