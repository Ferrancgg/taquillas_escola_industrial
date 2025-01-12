const bcrypt = require("bcrypt");

const verifyHash = async () => {
  const password = "1234"; // Contraseña que deseas probar
  const hash = "$2b$10$SOSLj8cGULsfKajuEKJwPO.TnaKAvhqHf8vvM2Bivbh00IQzwEUIq"; // Hash almacenado en la base de datos
  const isMatch = await bcrypt.compare(password, hash);

  console.log("¿Coinciden?", isMatch);
};

verifyHash();
