const { getAllLockers, getLockerById, createLocker, deleteLocker, updateLocker } = require("../controller/locker")

const lockerRouter=require("express").Router()

lockerRouter.get("/",getAllLockers)
lockerRouter.get("/:id",getLockerById)
lockerRouter.post("/",createLocker)
lockerRouter.delete("/:id",deleteLocker)
lockerRouter.put("/:id",updateLocker)

module.exports=lockerRouter