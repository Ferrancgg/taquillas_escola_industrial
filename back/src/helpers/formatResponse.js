const formatResponse = (data) => {
  if (!data || !data._id || !data.name || !data.userName || !data.role) {
    throw new Error("Invalid user object, from format response");
  }

  // Formatear directamente usando un objeto con claves específicas
  return {
    id: data._id,
    name: data.name,
    userName: data.userName,
    role: data.role,
  };
};

module.exports = formatResponse;
