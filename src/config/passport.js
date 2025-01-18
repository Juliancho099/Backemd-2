import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { createToken, SECRET } from "../utils/jwtUtils.js";
import { User } from "../models/userModels.js";
import { comparePassword } from "../utils/passworUtils.js";

export function initializePassport(){
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, email, password, done)=>{
        try {
          const { first_name, last_name, age, role } = req.body;

          if(!first_name || !last_name || !age){
            return done(null, false, {message: 'Please fill all fields'});
          }

          const user = await User.create({
            first_name,
            last_name,
            email,
            password,
            age,
            role,
          })

          return done(null, user);
        } catch (error) {
            console.log(error)
            done({message: error.message, status: 'hola el error esta aqui' });;
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, email, password, done)=>{
        try {
          const user = await User.findOne({ email });

          if (!user){
            return done(null, false, { message: 'User not found' });
          }

          const isValidPassword = comparePassword(password, user.password);

          if (!isValidPassword) return done(null, false, { message: 'Invalid credentials' });

          const token = createToken({ email: user.email, role: user.role, id: user._id });

          req.token = token;

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id);

          if (!user) return done(null, false);

          return done(null, payload);
        } catch (error) {
          console.log(done(error));
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);

    if (!user) return done(null, false);

    return done(null, user);
  });
}

function cookieExtractor(req) {
  return req && req.cookies ? req.cookies.token : null;
}




