const mongoose = require('mongoose');
require('dotenv').config()

mongoose.set('strictQuery', true);

const DB_URI = process.env.DB_URI

const options = { keepAlive: true, useNewUrlParser: true, useUnifiedTopology: true }

module.exports = () => {
  mongoose.connect(DB_URI, options)
    .then(() => {
      console.log('Conectado a la base de datos de MongoDB');
    })
    .catch(error => {
      console.error('ERROR DETECTADO: ' + error);
    });
}