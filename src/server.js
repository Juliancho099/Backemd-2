import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDb } from './db.js';
import { initializePassport } from './config/passport.js';
import passport from 'passport';
import { productsRouter } from './routers/productsRouter.js';
import { sessionRouter } from './routers/sessionRouter.js';
import { userRouter } from './routers/userRouter.js';

const app = express();
const PORT = 3000;
const dbName = 'ecommerce'
const uri = "mongodb+srv://Julian999:JulianJulian@cluster0.hs69b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport()
app.use(passport.initialize());
app.use(express.static('public'));

app.use('/api/auth', sessionRouter);
app.use('/api/products',passport.authenticate('jwt', {session: false}), productsRouter)
app.use('/api/current',passport.authenticate('jwt', {session: false}), userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Connect to DB

connectDb(uri, dbName);


