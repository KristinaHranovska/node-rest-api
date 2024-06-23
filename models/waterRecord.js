import mongoose from 'mongoose';

const getCurrentDate = () => {

    const now = new Date();
    
    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes()
    );
};
//додати овнера
// owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   }

const waterRecordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: getCurrentDate
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('WaterRecord', waterRecordSchema);
