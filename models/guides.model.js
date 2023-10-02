const mongoose = require('mongoose');

const GuidesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: false,
        },
        select: {
            type: String,
            unique: false,
        },
        imageUrl: {
            type: String,
            unique: false,
        },
        description: {
            type: String,
            unique: false,
        },
        nickname: {
            type: String,
            unique: false,
        },
        ppImage: {
            type: String,
            unique: false,
        },
        rank: {
            type: String,
            unique: false,
        },
    },
    
    {
        timestamps: true,
        versionKey: false
    }
);


const Guides = new mongoose.model('guides', GuidesSchema);

module.exports = { Guides }