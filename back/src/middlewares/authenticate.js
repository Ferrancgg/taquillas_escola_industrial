const jwt=require("jsonwebtoken")

const jwt = require("jsonwebtoken");

// Middleware para autenticar usuarios mediante token
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"
    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // Verificar y decodificar el token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decodedToken; // Guardar el usuario en req para usarlo en las rutas
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticate;

