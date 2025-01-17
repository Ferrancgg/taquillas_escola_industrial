const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const setError = require("../../config/error");
const User = require("../model/user");
const formatResponse = require("../../helpers/formatResponse");

const createUser = async (req, res, next) => {
  console.log("estoy aqui");
  try {
    console.log("Entrando en createUser");
    // Datos recibidos
    const { userName, email, password } = req.body;
    console.log("Datos recibidos:", { userName, email, password });

    // Validación de datos
    if (!userName || !email || !password) {
      console.log("Faltan campos requeridos");
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: userName, email, password.",
      });
    }
    // Verificación de duplicados
    console.log("Verificando duplicados...");
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      console.log("Usuario duplicado encontrado:", existingUser);
      return res.status(409).json({
        status: "error",
        message:
          existingUser.email === email
            ? "Email is already in use."
            : "UserName is already in use.",
      });
    }

    // Encriptación de contraseña
    console.log("Encriptando contraseña...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardando el usuario
    console.log("Guardando usuario...");
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    console.log("Usuario creado con éxito");
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error capturado en createUser:", error);
    return next(setError(500, "Unable to create user"));
    console.log("aqui");
  }
};

const login = async (req, res, next) => {
  console.log("estoy en login")
  try {
    const { userName, password } = req.body;

    // Buscar al usuario por nombre de usuario
    const user = await User.findOne({ userName });
    if (!user) {
      // Si el usuario no existe, devolver un error 404
      return next(setError(404, "User not found."));
    }

    console.log("Usuario encontrado:", user);

    // Comparar la contraseña proporcionada con la almacenada
    console.log("Password provided:", password);
    console.log("Password in database:", user.password);

    // Comparar la contraseña proporcionada con la almacenada
    
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  console.log("Contraseña incorrecta. No coincide con el hash.");
  return next(setError(401, "Incorrect password."));
}
    // Generar el token JWT para autenticar al usuario
    const token = generateSing(user._id);

    // Preparar una respuesta segura con datos mínimos del usuario
    const responseUser = {
      id: user._id,
      name: user.name,
      userName: user.userName,
      role: user.role,
    };

    // Responder con éxito y devolver el token junto con datos básicos del usuario
    return res.status(200).json({
      message: "Login successful.",
      user: responseUser,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    // Manejo de errores del servidor
    return next(setError(500, "Internal server error."));
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ status: "error", message: "No users found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return next(setError(500, "Error fetching users from the database"));
  }
};


// const login = async(req,res,next) => {
//   try {

    
//     const user=await User.findOne({userName:req.body.userName})
//     if(!user){return next(setError("400","el usuario no esta registrado"))}
//     if(bcrypt.compareSync(req.body.password,user.password)){
//       const token=generateSing(user._id)
//       return res.status(200).json({user,token})
//     }
//     else {next(setError("400", "password doesnt match"))} 

//   } catch (error) {
//     console.error("The error is the following:", error);
//     return next(setError(400, "Unable to login user"));
//   }
// };
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar el formato del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format.",
      });
    }

    // Buscar usuario por ID
    const user = await User.findById(id);

    // Manejar el caso de usuario no encontrado
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }
    const formatUser=formatResponse(user)
    // Respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "User retrieved successfully.",
      data: formatUser,
    });
  } catch (error) {
    console.error("The error is the following:", error);
    return next(setError(400, "Unable get user"));
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validar el formato del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "error", message: "Invalid user ID format." });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }

    // Definir campos permitidos para actualizar
    const allowedFields = ["name", "email", "userName", "phone", "additionalInfo", "role", "isActive", "lockerId"];
    const filteredUpdates = {};

    // Filtrar los campos permitidos del `req.body`
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Validar duplicados para `userName` y `email`
    if (filteredUpdates.userName || filteredUpdates.email) {
      const duplicate = await User.findOne({
        $or: [
          { userName: filteredUpdates.userName },
          { email: filteredUpdates.email },
        ],
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(409).json({
          status: "error",
          message: "UserName or Email already exists.",
        });
      }
    }

    // Validar que haya campos para actualizar
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No valid fields to update.",
      });
    }

    // Validar que el lockerId exista si se está actualizando
    if (filteredUpdates.lockerId) {
      const lockerExists = await Locker.findById(filteredUpdates.lockerId);
      if (!lockerExists) {
        return res.status(404).json({
          status: "error",
          message: "Locker not found.",
        });
      }
    }

    // Actualizar los datos del usuario
    Object.assign(user, filteredUpdates);
    const updatedUser = await user.save();

    // Usar `formatResponse` para devolver los datos esenciales
    const formattedUser = formatResponse(updatedUser);

    // Responder con éxito
    return res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      data: formattedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return next(setError(500, "Failed to update user."));
  }
};

// const deleteUser = async(req,res,next) => {
//   try {
//     const {id}=req.body
//     if(mongoose.Types.ObjectId.isValid(id)){
//       const deleteUser= await User.findByIdAndDelete(id)

//       if(!deleteUser){
//         return res.status().json({status:"error",message:"no el valido"})
//       }
//       return res.status(200).json({status:"success",
//         message:"delete correct",data:deleteUser
        
//       }

//     )
//       }
//       else{
//         return res.status(400).json({status:"error",message:"user not valid"})
//       }
//     }
//    catch (error) {
//     console.error("The error is the following:", error);
//     return next(setError(400, "Unable get user"));
//   }
// };çç

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;

    // Validar el formato del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format.",
      });
    }

    // Intentar eliminar el usuario
    const deleteUser = await User.findByIdAndDelete(id);

    // Manejar caso de usuario no encontrado
    if (!deleteUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found or already deleted.",
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "User deleted successfully.",
      data: deleteUser, // Información del usuario eliminado (opcional)
    });
  } catch (error) {
    console.error("Error en deleteUser:", error);
    return next(setError(500, "Unable to delete user"));
  }
};


module.exports = { createUser, deleteUser, getUser, login, updateUser,getAllUsers };
