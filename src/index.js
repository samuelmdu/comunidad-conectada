const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

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

app.get('/publicaciones', (req, res) => {
    res.render('public-views/publicaciones.html');
});

// ==========================
// ADMIN
// ==========================
app.get('/panel-admin', (req, res) => {
    res.render('admin/panel-admin.html');
});

// ==========================
// admin FORMS-VIEWS
// ==========================

app.get('/viewAnuncio', (req, res) => {
    res.render('admin/form-views/vistaAnuncio.html');
});

app.get('/viewEmprendimiento', (req, res) => {
    res.render('admin/form-views/vistaEmprendimiento.html');
});

/*app.get('/viewEvento', (req, res) => {
    res.render('admin/form-views/vistaEvento.ejs');
});*/

app.get('/viewReporte', (req, res) => {
    res.render('admin/form-views/vistaEvento.html');
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

// ╔══════════════════════════════════════════╗
// ║              Data base                   ║
// ╚══════════════════════════════════════════╝

const connectDB = require('./db');
const User = require('../models/users');
const Evento = require('../models/eventos');
const Anuncio = require('../models/anuncios')
const Rutas = require('../models/rutas')
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
        descripcion: req.body.descripcion, // corregido de "desciption" a "descripcion"
        phone: req.body.telefono,
        date: req.body.fecha,
        direction: req.body.ubicacion,
         aprobado: false // esto es CLAVE [para que el evento no se muestre hasta que sea aprobado por un admin
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
        const eventos = await Evento.find({ aprobado: true });
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

///// QUE SE APRUEBEN O ELIMINEN LOS EVENTOS recien agregado aza
// Aprobar evento
app.post('/aprobar-evento', async (req, res) => {
  const id = req.body.id;
  await Evento.findByIdAndUpdate(id, { aprobado: true });
  console.log("Evento aprobado:", id);
  res.redirect('/panel-admin');
});

// Eliminar evento
app.post('/eliminar-evento', async (req, res) => {
  const id = req.body.id;
  await Evento.findByIdAndDelete(id);
  console.log("Evento eliminado:", id);
  res.redirect('/panel-admin');
});

app.get('/viewEvento/:id', async (req, res) => {
  const { id } = req.params;

  try {
    //Agregá estos logs... para verificar que el ID se está recibiendo correctamente
    console.log("ID recibido:", id);
    
    const evento = await Evento.findById(id);

    if (!evento) return res.status(404).send("Evento no encontrado");

    // Renderiza el HTML de la vista y le pasa los datos del evento
    res.render('admin/form-views/vistaEvento.ejs', { evento }); // si usás EJS usá .ejs
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});
////
/////

