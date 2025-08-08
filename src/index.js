const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 4000;

// ╔══════════════════════════════════════════╗
// ║              Configuration               ║
// ╚══════════════════════════════════════════╝
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => console.log(`Puerto: ${port}`));

// ==========================
// COOKIES
// ==========================

const session = require('express-session');
app.use(session({
    secret: '@2-T2bS:0ZT0s',
    saveUninitialized: false,
    resave: false,
    cookie: {
        // 5 minutes
        maxAge: 10 * 60 * 1000,
    },
}));

app.use((req, res, next) => {
    res.locals.admin = req.session.admin || false;
    res.locals.loggedIn = req.session.loggedIn || false;
    res.locals.cedula = req.session.cedula || null;
    res.locals.name = req.session.name || null;
    res.locals.email = req.session.email || null;
    res.locals.phone = req.session.phone || null;

    next();
});

// ╔══════════════════════════════════════════╗
// ║              Routes                      ║
// ╚══════════════════════════════════════════╝


app.get('/', (req, res) => {
    res.render('public-views/feed.ejs');
});

// ==========================
// AUTHENTICATION
// ==========================

app.get('/log-in', (req, res) => {
    res.render('authentication/log-in.ejs');
});

app.get('/sign-up', (req, res) => {
    res.render('authentication/sign-up.ejs')
});

// ==========================
// PUBLIC-VIEWS
// ==========================
app.get('/feed', (req, res) => {
    res.render('public-views/feed.ejs');
});

app.get('/anuncio', (req, res) => {
    res.render('public-views/anuncio.ejs');
});

app.get('/anuncio-user', (req, res) => {
    res.render('public-views/anuncio-user.ejs');
});

app.get('/calendario', (req, res) => {
    res.render('public-views/calendario.ejs');
});

app.get('/emprendimiento', (req, res) => {
    res.render('public-views/emprendimiento.ejs');
});

app.get('/emprendimiento-user', (req, res) => {
    res.render('public-views/emprendimiento-user.ejs');
});

app.get('/evento', (req, res) => {
    const eventList = async () => {
        const eventos = await Evento.find();
        res.render('public-views/evento.ejs', {
            eventos: eventos
        });
    }
    eventList();
});

app.get('/evento-user', (req, res) => {
    res.render('public-views/evento-user.ejs');
});

app.get('/transporte', (req, res) => {
    res.render('public-views/transporte.ejs');
});

app.get('/transporte-admin', (req, res) => {
    res.render('public-views/transporte-admin.ejs');
});

app.get('/publicaciones', (req, res) => {
    res.render('public-views/publicaciones.ejs');
});

// ==========================
// ADMIN
// ==========================
app.get('/panel-admin', (req, res) => {
    // Verifica si el usuario es administrador antes de permitir el acceso al panel de administración.
    if (!req.session.admin) {
        res.redirect('/log-in');
    } else {
        res.render('admin/panel-admin.ejs');
    };
});

// ==========================
// USERS
// ==========================
app.get('/profile', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/log-in');
    } else {
        res.render('users/profile.ejs');
    }

});

// ==========================
// ADMIN FORMS-VIEWS
// ==========================

app.get('/viewAnuncio', (req, res) => {
    res.render('admin/form-views/vistaAnuncio.ejs');
});

app.get('/viewEmprendimiento', (req, res) => {
    res.render('admin/form-views/vistaEmprendimiento.ejs');
});

app.get('/viewEvento', (req, res) => {
    res.render('admin/form-views/vistaEvento.ejs');
});

app.get('/viewReporte', (req, res) => {
    res.render('admin/form-views/vistaEvento.ejs');
});


// ==========================
// FORMS
// ==========================
app.get('/form-anuncio', (req, res) => {
    res.render('forms/form-anuncio.ejs');
});

app.get('/form-emprendimiento', (req, res) => {
    res.render('forms/form-emprendimiento.ejs');
});

app.get('/form-evento', (req, res) => {
    res.render('forms/form-evento.ejs');
});

app.get('/form-reporte', (req, res) => {
    res.render('forms/form-reporte.ejs');
});

app.get('/form-transporte', (req, res) => {
    res.render('forms/form-transporte.ejs');
});

app.get('/editar-transporte', async (req, res) => {
    try {
        const rutaId = req.query.id;
        const ruta = await Rutas.findById(rutaId);

        if (!ruta) {
            return res.status(404).send('Ruta no encontrada');
        }

        res.render('forms/editar-transporte.ejs', {
            ruta: ruta,
            rutaId: rutaId
        });
    } catch (error) {
        console.error("Error al obtener la ruta:", error);
    }
});


app.get('/evento/:id', async (req, res) => {
    try {

        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).send('Evento no encontrado');
        }

        res.render('public-views/evento-user', { evento });
    } catch (error) {
        console.error("Error al obtener el evento:", error);
        res.status(500).send('Error del servidor');
    }
});


// ╔══════════════════════════════════════════╗
// ║              Data base                   ║
// ╚══════════════════════════════════════════╝

const connectDB = require('./db');
const User = require('../models/users');
const Evento = require('../models/eventos');
const Anuncio = require('../models/anuncios')
const Rutas = require('../models/rutas')
const Admin = require('../models/admins');
connectDB();

// ==========================
// AUTHENTICATION
// ==========================

// Revisa si ya hay un administrador creado, si no lo hay, lo crea. 

const existeAdmin = async () => {
    const admin = await Admin.findOne({ email: 'admin@gmail.com' });

    if (admin != null) {
        console.log('Administrador ya existe');
    } else {
        let adminData = new Admin({
            name: 'Administrador',
            email: 'admin@gmail.com',
            password: '1234'
        });

        await adminData.save()
            .then(() => {
                console.log('Administrador creado');
            })
            .catch((err) => {
                console.log("ERROR", err);
            });

    }
}
existeAdmin();

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

    const identificarAdmin = async () => {
        const admin = await Admin.findOne({ email: 'admin@gmail.com' });


        if (admin != null) {
            if (data.password == admin.password) {
                req.session.admin = true;
                req.session.loggedIn = true;
                req.session.name = admin.name;
                res.redirect('/panel-admin');
            } else {
                res.redirect('/log-in');
            }
        }
    };

    const existeUser = async () => {

        const usuario = await User.findOne({ email: data.email });

        if (usuario != null) {
            if (data.password == usuario.password) {

                req.session.loggedIn = true;
                req.session.cedula = usuario.cedula;
                req.session.name = usuario.name;
                req.session.email = usuario.email;
                req.session.phone = usuario.phone;

                if (req.session.loggedIn) {
                    res.redirect('/');
                }

            } else {
                console.log("La contrasena es incorrecta");
                res.redirect('/log-in')
            }

        } else {
            console.log("El usuario no se encontro")
            res.redirect('/log-in')
        }
    };

    if (data.email == 'admin@gmail.com') {
        identificarAdmin();
    } else {
        existeUser();
    }
});

app.get('/log-out', (req, res) => {

    req.session.destroy((error) => {
        if (error) {
            console.log('Error');
        }
        res.redirect('/')
    });
});


// ==========================
// FORMS
// ==========================


app.post('/addEvent', async (req, res) => {
    let data = new Evento({
        eventName: req.body.evento,
        creatorName: req.body.creatorName,
        description: req.body.descripcion,
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
        description: req.body.descripcion,
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


app.post('/addRuta', async (req, res) => {
    let data = new Rutas({
        rutaNombre: req.body.ruta,
        rutaHorario: req.body.horario,
        rutaFrecuencia: req.body.frecuencia,
        rutaPrecio: req.body.precio

    })
    await data.save()
        .then(() => {
            console.log('Ruta registrada');
        })
        .catch((err) => {
            console.log("ERROR", err);
        })
    res.redirect('/form-transporte')
});

app.post('/actualizar-ruta', async (req, res) => {
    try {
        const rutaId = req.body.id;

        const updatedData = {
            rutaNombre: req.body.ruta,
            rutaHorario: req.body.horario,
            rutaFrecuencia: req.body.frecuencia,
            rutaPrecio: req.body.precio
        };

        await Rutas.findByIdAndUpdate(rutaId, updatedData);
        res.redirect('/transporte-admin');
    } catch (error) {
        console.error("Error al actualizar la ruta:", error);
    }
});



//AQUI MUESTRO EN CONSOLA LOS EVENTOS REGISTRADOS SOLO PARA PRUEBAS > MANTENER CODIGO DORMIDO
// const mostrar = async() => {
//     const eventos = await Evento.find();
//     console.log(eventos);
//     console.log("FIN DE LOS EVENTOS EN LA BD");
// }
//mostrar()


//OBTENER EVENTOS PARA PODER ENVIARLOS DESDE EL BACK, ESTO YA QUE AL PARECER NO SE PUEDE USAR DOM DESDE NODE JS, ENTONCES LO ENVIAMOS COMO UN PAQUETE HASTA EL FRONT END
app.get('/api/eventos', async (req, res) => {
    try {
        const eventos = await Evento.find();
        res.json(eventos);
    } catch (err) {
        console.error("Error obteniendo eventos:", err);
    }
});

app.get('/api/rutas', async (req, res) => {
    try {
        const rutas = await Rutas.find();
        res.json(rutas);
        console.log(rutas)
    } catch (err) {
        console.error("Error obteniendo rutas:", err);
    }
});
