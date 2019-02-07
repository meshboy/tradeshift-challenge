/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
require('dotenv').config()

export const connect = () => mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });