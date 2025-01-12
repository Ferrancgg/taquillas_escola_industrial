// Middleware para verificar roles
const verifyRole = (roles) => {
    return (req, res, next) => {
      try {
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: "Access forbidden: insufficient permissions." });
        }
        next();
      } catch (error) {
        console.error("Role verification error:", error);
        return res.status(500).json({ message: "Error verifying role." });
      }
    };
  };
  
  module.exports = verifyRole;
  