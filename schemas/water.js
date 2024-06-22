import { Schema, model } from 'mongoose';

const waterSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true,
    }
}, { timestamps: true });

export const Water = model('water', waterSchema);
