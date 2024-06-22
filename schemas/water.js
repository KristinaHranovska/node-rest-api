import { Schema, model } from 'mongoose';

const waterSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Water = model('water', waterSchema);
