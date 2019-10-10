import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passportStrategyId: string;
    photo: string;
    [key: string]: any;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passportStrategyId: {
        type: String,
    },
    photo: {
        type: String,
    },
});

export const User = mongoose.model<IUser>('User', userSchema);
