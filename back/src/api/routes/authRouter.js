const { login } = require("../controller/user")

const authRouter=require("express").Router()

authRouter.post("/login",login)
module.exports=authRouter