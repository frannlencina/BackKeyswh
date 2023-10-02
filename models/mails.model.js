const mongoose = require('mongoose');

const MailsSchema = new mongoose.Schema(
    {
        gmail: {
            type: String,
            unique: true,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Mails = new mongoose.model('mails', MailsSchema);

module.exports = { Mails }