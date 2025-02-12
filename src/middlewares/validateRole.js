
export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado: Solo el administrador puede realizar esta acción" });
    }
    next();
  };


  export const isUser = (req, res, next) => {
    if (req.user?.role !== "user") {
      return res.status(403).json({ message: "Acceso denegado: Solo los usuarios pueden agregar productos al carrito" });
    }
    next();
  }; 