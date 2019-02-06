/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import mongoose from 'mongoose';

export const connect = () => mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });