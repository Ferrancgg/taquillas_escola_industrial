const mongoose=require("mongoose")


const lockerSchema= new mongoose.Schema({
  
    location: {
        type: String,
        required: true, // Ejemplo: "Planta Baja - Aula 1"
      },
      status: {
        type: String,
        required: true,
        enum: ["available", "occupied"], // Solo puede ser "available" o "occupied"
        default: "available", // Por defecto está disponible
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relación con el modelo de User
        default: null, // Si no está asignada, será null
      },
      notes: {
        type: String,
        default: null, // Campo opcional para información adicional
      },

},{timestamps:true, collection:"locker"})

const Locker=  mongoose.model("Locker",lockerSchema)

module.exports=Locker