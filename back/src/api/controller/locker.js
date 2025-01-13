const { default: mongoose } = require("mongoose");
const setError = require("../../config/error")
const Locker = require("../model/locker")




// const getAllLockers = async (req, res, next) => {
//     try {
//         const allLockers = await Locker.find();
//         return res.status(200).json({ status: successfull, message: "encontrados", data: allLockers });
//     } catch (error) {
//         return next(setError(500, "An error occurred while fetching lockers"));
//     }
// };


const getAllLockers = async (req, res, next) => {
    try {
        const allLockers = await Locker.find();
        if (!allLockers || allLockers.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'No lockers found',
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Lockers retrieved successfully',
            data: allLockers,
        });
    } catch (error) {
        console.error('Error fetching lockers:', error);
        next(setError(500, 'Error fetching lockers'));
    }
};



const getLockerById = async (req, res, next) => {
    try {
        // Paso 1: Extraer el ID del parámetro de la URL
        const { id } = req.params;

        // Paso 2: Buscar la taquilla en la base de datos usando findById
        // const locker = await Locker.findById(id).populate("assignedTo", "name email");
        const locker = await Locker.findById(id)
        // Paso 3: Validar si la taquilla no existe
        if (!locker) {
            return next(setError(404, "Locker not found"));
        }

        // Paso 4: Responder con la taquilla encontrada
        return res.status(200).json({
            status: "successful",
            message: "Locker found",
            data: locker,
        });
    } catch (error) {
        // Paso 5: Manejar errores inesperados
        console.error("Error fetching locker by ID:", error);
        return next(setError(500, "An error occurred while fetching the locker"));
    }
};

const createLocker = async (req, res, next) => {
    try {
        const newLocker = new Locker(req.body); // Crear el documento
        await newLocker.save(); // Guardar en la base de datos
        return res.status(201).json({
            status: "success",
            message: "Locker created successfully", // Mensaje adicional
            data: newLocker, // Incluye el locker creado
        });
    } catch (error) {
        return next(setError(500, "Failed to create the locker"));
    }
};

const deleteLocker = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar si el ID está presente y tiene el formato correcto
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(setError(400, "Invalid or missing locker ID"));
        }

        // Intentar encontrar y eliminar la taquilla
        const locker = await Locker.findByIdAndDelete(id);

        // Si no se encuentra la taquilla
        if (!locker) {
            return next(setError(404, "Locker not found"));
        }

        // Respuesta exitosa
        return res.status(200).json({
            status: "success",
            message: "Locker deleted successfully",
            data: locker,
        });
    } catch (error) {
        console.error("Error deleting locker:", error);
        return next(setError(500, "An error occurred while deleting the locker"));
    }
};




const updateLocker = async (req, res, next) => {
    try {
        // Logic goes here
    } catch (error) {
        return next(setError(400, "Failed to update the locker or invalid data"));
    }
};

module.exports = { updateLocker, getAllLockers, getLockerById, createLocker, updateLocker,deleteLocker };
