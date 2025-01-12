// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true }, // Nombre completo
//     userName: { type: String, required: true, unique: true }, // Nombre de usuario único
//     email: { type: String, required: true, unique: true }, // Correo único
//     password: { type: String, required: true, minlength: 8 }, // Contraseña con longitud mínima
//     role: {
//       type: String,
//       required: true,
//       enum: ["student", "teacher", "admin"],
//     }, // Rol
//     isActive: { type: Boolean, default: true }, // Estado de la cuenta (activo por defecto)
//     lockerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Locker",
//       default: null,
//     }, // Referencia a la taquilla asignada
//     phone: { type: String, default: null }, // Teléfono del usuario (opcional)
//     additionalInfo: { type: String, default: null }, // Información adicional (opcional)
//   },
//   { timestamps: true, collection: "users" } // Timestamps para createdAt y updatedAt
// );

// ///aqui vamos a proteger las contraseñas para que se encripten con este middleware
// //voy a comprovar si la contraseña ha sido
// //  modificada para cuando se hagan modificaciones
// //  de otros datos, si la contraseña no ha sido 
// // modificada no tendria que cambiarse y asi evitar errores.


// userSchema.pre("save",async function(next) {
//   if(!this.isModified("password")){return next()}
//   try{
//     this.password=await bcrypt.hash(this.password,10)
//     next()
//   }catch (error) {
//     console.error("Error capturado al encriptar contraseña", error);
//     return next(setError(400, "algo ha fallado al encriptar contraseña"));
    
//   }
  
// }
// )

// // Corrección para crear y exportar el modelo
// const User = mongoose.model("User", userSchema);

// module.exports = User;


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nombre completo
    userName: { type: String, required: true, unique: true }, // Nombre de usuario único
    email: { type: String, required: true, unique: true }, // Correo único
    password: { type: String, required: true, minlength: 8 }, // Contraseña con longitud mínima
    role: {
      type: String,
      required: true,
      enum: ["student", "teacher", "admin"],
    }, // Rol
    isActive: { type: Boolean, default: true }, // Estado de la cuenta (activo por defecto)
    lockerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locker",
      default: null,
    }, // Referencia a la taquilla asignada
    phone: { type: String, default: null }, // Teléfono del usuario (opcional)
    additionalInfo: { type: String, default: null }, // Información adicional (opcional)
  },
  { timestamps: true, collection: "users" } // Timestamps para createdAt y updatedAt
);

// Middleware para encriptar contraseñas
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  console.log("Encriptando contraseña para el usuario:", this.userName); // Log para depuración
  try {
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Contraseña encriptada:", this.password); // Log del hash generado
    next();
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error.message);
    return next(new Error("Error al encriptar la contraseña"));
  }
});



// Crear y exportar el modelo
const User = mongoose.model("User", userSchema);

module.exports = User;
