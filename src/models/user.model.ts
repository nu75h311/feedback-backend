import * as mongoose from 'mongoose';
import { IUser } from '@interfaces';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    id: String,
});

export const userModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);