const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
    {
        nick: {
            type: String,
            unique: true,
        },
        token: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            unique: true,
        },
        rank: {
            type: String,
            unique: true,
        },
        pp_image: {
            type: String,
            unique: true,
        },
        publicaciones: {
            type: String,
            unique: true,
        },
        noticias: {
            type: String,
            unique: true,
        },
        guias: {
            type: String,
            unique: true,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Admins = new mongoose.model('admins', AdminSchema);

module.exports = { Admins }