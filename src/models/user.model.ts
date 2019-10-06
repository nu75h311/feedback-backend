import * as mongoose from 'mongoose';
import { IUser } from '@interfaces';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passportStrategyId: {
        type: String,
    },
    photo: {
        type: String,
    },
});

export const userModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);
