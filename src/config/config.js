import {config} from 'dotenv';

config();

export const CONFIG = {
    PORT: process.env.PORT || 3000,
    DB_NAME: process.env.DB_NAME || 'ecommerce',
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017',
}