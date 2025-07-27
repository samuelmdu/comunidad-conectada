const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 5000;

// Configuration
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => console.log(`Puerto: ${port}`));

// ╔══════════════════════════════════════════╗
// ║              Routes                      ║
// ╚══════════════════════════════════════════╝


app.get('/', (req, res) => {
    res.render('public-views/feed.html');
});

// ==========================
// AUTHENTICATION
// ==========================

app.get('/log-in', (req, res) => {
    res.render('authentication/log-in.html');
});

app.get('/sign-up', (req, res) => {
    res.render('authentication/sign-up.html')
});

// ==========================
// PUBLIC-VIEWS
// ==========================
app.get('/feed', (req, res) => {
    res.render('public-views/feed.html');
});

app.get('/anuncio', (req, res) => {
    res.render('public-views/anuncio.html');
});

app.get('/anuncio-user', (req, res) => {
    res.render('public-views/anuncio-user.html');
});

app.get('/calendario', (req, res) => {
    res.render('public-views/calendario.html');
});

app.get('/emprendimiento', (req, res) => {
    res.render('public-views/emprendimiento.html');
});

app.get('/emprendimiento-user', (req, res) => {
    res.render('public-views/emprendimiento-user.html');
});

app.get('/evento', (req, res) => {
    res.render('public-views/evento.html');
});

app.get('/evento-user', (req, res) => {
    res.render('public-views/evento-user.html');
});

app.get('/transporte', (req, res) => {
    res.render('public-views/transporte.html');
});

app.get('/transporte-admin', (req, res) => {
    res.render('public-views/transporte-admin.html');
});

// ==========================
// ADMIN
// ==========================
app.get('/panel-admin', (req, res) => {
    res.render('admin/panel-admin.html');
});

// ==========================
// FORMS
// ==========================
app.get('/form-anuncio', (req, res) => {
    res.render('forms/form-anuncio.html');
});

app.get('/form-emprendimiento', (req, res) => {
    res.render('forms/form-emprendimiento.html');
});

app.get('/form-evento', (req, res) => {
    res.render('forms/form-evento.html');
});

app.get('/form-reporte', (req, res) => {
    res.render('forms/form-reporte.html');
});

app.get('/form-transporte', (req, res) => {
    res.render('forms/form-transporte.html');
});

app.get('/editar-transporte', (req, res) => {
    res.render('forms/editar-transporte.html');
});

// ╔══════════════════════════════════════════╗
// ║              Data base                   ║
// ╚══════════════════════════════════════════╝

const connectDB = require('./db');
const User = require('../models/users');
const Evento = require('../models/eventos');
const Anuncio = require('../models/anuncios')
connectDB();

// ==========================
// AUTHENTICATION
// ==========================


app.post('/register', async (req, res) => {

    let data = new User({

        cedula: req.body.cedula,
        name: req.body.nombre,
        email: req.body.correo,
        phone: req.body.telefono,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation

    });

    await data.save()
        .then(() => {
            console.log('Usuario registrado');
        })
        .catch((err) => {
            console.log("ERROR", err);
        })
    res.redirect('/log-in')

});

app.post('/authenticate', (req, res) => {

    let data = {
        email: req.body.correo,
        password: req.body.password
    }

    const existeUser = async () => {

        const usuario = await User.findOne({ email: data.email });
        console.log(usuario);

        if (usuario != null) {
            if (data.password == usuario.password) {
                console.log("La información es correcta");
                res.redirect('/');
            } else {
                console.log("La contrasena es incorrecta");
                res.redirect('/log-in')
            }

        } else {
            console.log("El usuario no se encontro")
            res.redirect('/log-in')
        }
    };

    existeUser();
});


// ==========================
// FORMS
// ==========================


app.post('/addEvent', async (req, res) => {
    let data = new Evento({
        eventName: req.body.evento,
        creatorName: req.body.creatorName,
        desciption: req.body.descripcion,
        phone: req.body.telefono,
        date: req.body.fecha,
        direction: req.body.ubicacion,
    });
    await data.save()
        .then(() => {
            console.log('Evento registrado');
        })
        .catch((err) => {
            console.log("ERROR", err);
        })
    res.redirect('/form-evento')
});

app.post('/addAnuncio', async (req, res) => {
    let data = new Anuncio({
        anuncioName: req.body.anuncio,
        creatorName: req.body.nombre,
        desciption: req.body.descripcion,
        date: req.body.fecha,

    })
    await data.save()
        .then(() => {
            console.log('Anuncio registrado');
        })
        .catch((err) => {
            console.log("ERROR", err);
        })
    res.redirect('/form-anuncio')
});