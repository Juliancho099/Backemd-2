import passport from "passport";

export function validate (dto){
    return (req, res, next) => {
        const {error} = dto.validate(req.body);
        if (error) return res.status(400).json(error.details[0].message);
        next();
    }
}

export function validateRegister (req, res, next) {
    passport.authenticate('register', { session: false }, (err, user, info) => {
      if (err) return next(err); // Si hay un error en Passport, lo pasamos
  
      if (!user) {
        return res.status(400).json({ message: info?.message || "Error en el registro" });
      }
  
      res.status(201).json({ message: 'Usuario registrado con éxito', user });
    })(req, res, next);
  };