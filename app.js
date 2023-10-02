const express = require('express');
const mongoose = require('mongoose');
const initDB = require('./db')
const port = 3001

const app = express()

const cors = require('cors');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cors())

app.get('/', cors(), (req, res) => res.send({ title: 'Hello!' }))
app.listen(port, () => console.log(`Aplicacion en Linea`))

mongoose.connection.set("userCreateIndex", true);

initDB();

const { Admins } = require('./models/user.model')
const { Guides } = require('./models/guides.model')
const { News } = require('./models/news.model')

const jwt = require('jsonwebtoken');
const { Mails } = require('./models/mails.model');

const JSONWEBTOKEN_KEY = process.env.JSONWEBTOKEN_KEY;
const AUTHORIZATION_TOKEN = process.env.AUTHORIZATION_TOKEN;

const DB_CREATE = process.env.DB_CREATE;
const DB_LOGIN = process.env.DB_LOGIN;

// 🔼 Imports, Constantes, Inicio de DB.

// 🔽 Middleware. 

function authenticate(req, res, next) {
  // Obtener el token de acceso de la solicitud
  const token = req.headers.authorization.split(' ')[1];

  // Verificar si se proporcionó un token
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de acceso' });
  }
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JSONWEBTOKEN_KEY);
    // Verificar si el token es válido y correspode a un usuario autenticadon

    // Almacenar la información del usuario autenticado en el objeto de solicitud para su uso posterior
    req.user = decoded;

    // Llamar a next() para pasar al siguiente middleware o ruta
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token de acceso inválido ' });
  }
}

// 🔽 Manejo de Peticiones. 

// Manejo de Peticion GET en AdminLogin. 

app.get(`/${DB_LOGIN}/`, cors(), (req, res) => res.send({ title: 'Hello Admin!' }))

// Manejo de Peticion POST en AdminLogin.

app.post(`/${DB_LOGIN}/`, async (req, res) => {

  const { token, password } = req.body
  const values = [token, password]

  const resultado = await Admins.findOne({ token: values[0], password: values[1] })
    .then(resultado => {

      console.log('Datos encontrados:' + resultado);

      if (resultado && resultado.token) {
        const datosToken = { datosToken: resultado.token };
        const tokenJWT = jwt.sign(datosToken, JSONWEBTOKEN_KEY, { expiresIn: '1h' });

        res.json({ tokenJWT, resultado });
        console.log(tokenJWT);
      } else {
        res.status(500);
        console.log('TOKEN UNDEFINED');
      }
    });
}
);

// Get en Guides

app.get('/guides', async (req, res) => {
  const allSearch = await Guides.find({});
  res.send(allSearch);
})

app.get(`/${DB_CREATE}/guides`, async (req, res) => {
  const allSearch = await Guides.find({});
  res.send(allSearch);
})

// Post en Guides

app.post(`/${DB_CREATE}/guides`, authenticate, async (req, res) => {
  const { title, select, imageUrl, description, nickname, rank, ppImage } = req.body
  const values = [title, select, imageUrl, description, nickname, rank, ppImage]
  res.send(values);
  agregarGuides(values)
})

const agregarGuides = (values) => {
  Guides.create(
    {
      title: values[0],
      select: values[1],
      imageUrl: values[2],
      description: values[3],
      nickname: values[4],
      rank: values[5],
      ppImage: values[6],
    }
  )
}
// Put en Guides

app.put(`/${DB_CREATE}/guides`, authenticate, async (req, res) => {
  try {
    const { title, imageUrl, description, nickname, rank, ppImage, id } = req.body
    const values = [title, imageUrl, description, nickname, rank, ppImage, id]
    const cardId = values[6];
    res.send(values);
    console.log('RECIBIDO NEWS' + cardId);
    await editarPublicacionGuides(values, cardId);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la publicación');
  }
});

const editarPublicacionGuides = async (values, cardId) => {
  const resultado = await Guides.updateOne(
    {
      _id: cardId
    },
    {
      title: values[0],
      imageUrl: values[1],
      description: values[2],
      nickname: values[3],
      rank: values[4],
      ppImage: values[5],
    },

  )
  console.log(resultado);
}

// Get en News
app.get(`/${DB_CREATE}/news`, async (req, res) => {
  const allSearch = await News.find({});
  res.send(allSearch);
})

// Post en News
app.post(`/${DB_CREATE}/news`, authenticate, async (req, res) => {
  try {
    const { title, select, imageUrl, description, nickname, rank, ppImage } = req.body
    const values = [title, select, imageUrl, description, nickname, rank, ppImage]
    agregarNews(values)
    res.send(values);
   // res.send('Publicacion ' + title + ' agregada correctamente');
  }catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar la publicación');
  }
})

const agregarNews = (values) => {
  News.create(
    {
      title: values[0],
      select: values[1],
      imageUrl: values[2],
      description: values[3],
      nickname: values[4],
      rank: values[5],
      ppImage: values[6],
    }
  )
}

app.delete(`/${DB_CREATE}/news/:id`, authenticate, async (req, res) => {
  const cardId = req.params.id
  const busqueda = await News.deleteOne({ _id: cardId })
  res.send(cardId)
  console.log(`La tarjeta con id: ${cardId} ha sido eliminada`)
});

app.delete(`/${DB_CREATE}/guides/:id`, authenticate, async (req, res) => {
  const cardId = req.params.id
  const busqueda = await Guides.deleteOne({ _id: cardId })
  res.send(cardId)
  console.log(`La tarjeta con id: ${cardId} ha sido eliminada`)

});

// Put en News

app.put(`/${DB_CREATE}/news`, authenticate, async (req, res) => {
  try {
    const { title, imageUrl, description, nickname, rank, ppImage, id } = req.body
    const values = [title, imageUrl, description, nickname, rank, ppImage, id]
    const cardId = values[6];
    res.send(values);
    console.log('RECIBIDO NEWS' + cardId);
    await editarPublicacionNews(values, cardId);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la publicación');
  }
});

const editarPublicacionNews = async (values, cardId) => {
  const resultado = await News.updateOne(
    {
      id: cardId
    },
    {
      title: values[0],
      imageUrl: values[1],
      description: values[2],
      nickname: values[3],
      rank: values[4],
      ppImage: values[5],
    }
  )
  console.log(resultado);
}

// Post de Mails

app.post(`/mails`, async (req, res) => {
  const { gmail } = req.body
  const values = [gmail]
  const existingMail = await Mails.findOne({ gmail }); // Consulta para verificar si el correo ya existe en la base de datos
  
  if (existingMail) {
    res.send("El correo electrónico ya está en la base de datos."); // Envía un mensaje al front-end indicando que el correo ya existe
  }else{
    agregarMails(values);
    res.send(values);
  }
})

const agregarMails = (values) => {
  Mails.create(
    {
      gmail: values[0],
    }
  )
}

// Post de Admins

app.put('admin/profile', authenticate, async (req, res) => {
  try {
    const { publicaciones, noticias, guias, id } = req.body
    const values = [ publicaciones, noticias, guias, id];
    const cardId = values[6];
    res.send(values);
    await guardarInfoPerfil(values, cardId);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la publicación');
  }
});

const guardarInfoPerfil = async (values, cardId) => {
  const resultado = await Admins.updateOne(
    {
      id: cardId
    },
    {
      publicaciones: values[0],
      noticias: values[1],
      guias: values[2],
    }
  )
  console.log(resultado);
}