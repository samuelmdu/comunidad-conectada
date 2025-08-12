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
    const anuncioList = async () => {
        const anuncios = await Anuncio.find();
        res.render('public-views/anuncio.ejs', {
            anuncios: anuncios
        });
    }
    anuncioList();
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

app.get('/publicaciones', async (req, res) => {
    try {
        if (!req.session.loggedIn) return res.redirect('/log-in');

        const anuncios = await Anuncio.find({ creatorId: req.session.userId, status: 'approved' });
        const eventos = await Evento.find({ creatorId: req.session.userId, status: 'approved' });
        const emprendimientos = await Emprendimiento.find({ creatorId: req.session.userId, status: 'approved' });
        const reportes = await Reporte.find({ creatorId: req.session.userId, status: 'approved' });

        res.render('public-views/publicaciones.ejs', {
            anuncios,
            eventos,
            emprendimientos,
            reportes
        });
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        res.redirect('/');
    }
});


// ==========================
// ADMIN
// ==========================

app.get('/panel-admin', async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/');
    }

    try {
        const tickets = await Ticket.find({})
            .populate('publicationId')
            .sort({ createdAt: -1 }); // Ordenar por fecha descendente

        res.render('admin/panel-admin.ejs', { tickets });
    } catch (error) {
        console.error("Error al cargar panel admin:", error);
        res.redirect('/');
    }
});

// ==========================
// USERS
// ==========================
app.get('/profile', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/log-in');
    } else {

        const myPublications = async () => {
            // Obtiene los anuncios y eventos creados por el usuario actual. 
            const anuncios = await Anuncio.find({ creatorName: req.session.name });
            const eventos = await Evento.find({ creatorName: req.session.name });

            res.render('users/profile.ejs', {
                anuncios: anuncios,
                eventos: eventos,
            })

        }

        myPublications();
    }
});

app.get('/registerAdmin', async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/');
    }

    try {
        // Aquí va la lógica que quieras ejecutar
        res.render('admin/new-admin.ejs'); // por ejemplo, cargar una vista
    } catch (error) {
        console.error("Error al cargar registerAdmin:", error);
        res.redirect('/');
    }
});



// ==========================
// admin FORMS-VIEWS
// ==========================

// ANUNCIO
app.get('/viewAnuncio', async (req, res) => {
    if (!req.session.admin) return res.redirect('/');
    const publicationId = req.query.publicationId;
    const ticketId = req.query.ticketId;

    try {
        const anuncio = await Anuncio.findById(publicationId);
        if (!anuncio) return res.status(404).send('Anuncio no encontrado');

        let ticket;
        if (ticketId) {
            ticket = await Ticket.findById(ticketId);
        } else {
            // fallback: ticket más reciente para esa publicación
            ticket = await Ticket.findOne({ publicationId: publicationId, type: 'anuncio' }).sort({ createdAt: -1 });
        }

        if (!ticket) return res.status(404).send('Ticket no encontrado');

        res.render('admin/form-views/vistaAnuncio.ejs', { anuncio, ticket });
    } catch (err) {
        console.error('Error al obtener anuncio:', err);
        res.redirect('/panel-admin');
    }
});


// EMPRENDIMIENTO
app.get('/viewEmprendimiento', async (req, res) => {
    if (!req.session.admin) return res.redirect('/');
    const publicationId = req.query.publicationId;
    const ticketId = req.query.ticketId;

    try {
        const emprendimiento = await Emprendimiento.findById(publicationId);
        if (!emprendimiento) return res.status(404).send('Emprendimiento no encontrado');

        let ticket;
        if (ticketId) {
            ticket = await Ticket.findById(ticketId);
        } else {
            ticket = await Ticket.findOne({ publicationId: publicationId, type: 'emprendimiento' }).sort({ createdAt: -1 });
        }

        if (!ticket) return res.status(404).send('Ticket no encontrado');

        res.render('admin/form-views/vistaEmprendimiento.ejs', { emprendimiento, ticket });
    } catch (err) {
        console.error('Error al obtener emprendimiento:', err);
        res.redirect('/panel-admin');
    }
});


/* el get de evento ASI ANTES
app.get('/viewEvento', async (req, res) => {
    const eventoId = req.query.id;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) return res.status(404).send("Evento no encontrado");
        res.render('admin/form-views/vistaEvento.ejs', { evento });
    } catch (error) {
        console.error("Error al obtener evento:", error);
        res.redirect('/panel-admin');
    }
});*/

app.get('/viewEvento', async (req, res) => {
    if (!req.session.admin) return res.redirect('/');
    const publicationId = req.query.publicationId;
    const ticketId = req.query.ticketId;

    try {
        const evento = await Evento.findById(publicationId);
        if (!evento) return res.status(404).send('Evento no encontrado');

        let ticket;
        if (ticketId) {
            ticket = await Ticket.findById(ticketId);
        } else {
            ticket = await Ticket.findOne({ publicationId: publicationId, type: 'evento' }).sort({ createdAt: -1 });
        }

        if (!ticket) return res.status(404).send('Ticket no encontrado');

        res.render('admin/form-views/vistaEvento.ejs', { evento, ticket });
    } catch (err) {
        console.error('Error al obtener evento:', err);
        res.redirect('/panel-admin');
    }
});

/*app.get('/viewReporte', (req, res) => {
    res.render('admin/form-views/vistaReporte.ejs');
});*/

// (OPCIONAL) REPORTE — solo si tienes modelo Reporte
// const Reporte = require('../models/reportes'); // si existe

app.get('/viewReporte', async (req, res) => {
    if (!req.session.admin) return res.redirect('/');
    const publicationId = req.query.publicationId;
    const ticketId = req.query.ticketId;

    try {
        const reporte = await Reporte.findById(publicationId);
        if (!reporte) return res.status(404).send('Reporte no encontrado');

        let ticket;
        if (ticketId) {
            ticket = await Ticket.findById(ticketId);
        } else {
            ticket = await Ticket.findOne({
                publicationId: publicationId,
                type: 'reporte'
            }).sort({ createdAt: -1 });
        }

        if (!ticket) return res.status(404).send('Ticket no encontrado');

        res.render('admin/form-views/vistaReporte.ejs', { reporte, ticket });
    } catch (err) {
        console.error('Error al obtener reporte:', err);
        res.redirect('/panel-admin');
    }
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

// ==========================
// DETALLES DE ANUNCIO Y EVENTO
// ==========================

// En estas rutas se obtiene el ID del anuncio o evento desde la URL, se busca en la base de datos y se renderiza la vista correspondiente con los datos obtenidos.
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


app.get('/anuncio/:id', async (req, res) => {
    try {

        const anuncio = await Anuncio.findById(req.params.id);
        if (!anuncio) {
            return res.status(404).send('Anuncio no encontrado');
        }
        res.render('public-views/anuncio-user', { anuncio });
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
const Emprendimiento = require('../models/Emprendimientos');
const Ticket = require('../models/tickets');
const UserAdmin = require('../models/user-admin');
const Reporte = require('../models/reportes');

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

app.post('/addReport', async (req, res) => {
    let data = new Reporte({
        reporte: req.body.reporte,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        notificado: req.body.notificado,
        correo: req.body.correo,
    })
    await data.save()
        .then(() => {
            console.log('Reporte registrado');
        })
        .catch((err) => {
            console.log("ERROR", err);
        })
    res.redirect('/form-reporte')
});


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

    /* IDENTIFICACION ORIGINAL DEL ADMIN
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
    };*/

    ///IDITENTIFICACION DEL ADMIN ORIGINAL Y TAMBINE CON UNO QUE SE CREE DESDE EL PANEL DE ADMIN
    const identificarAdmin = async () => {
        // Buscar en Admin "principal"
        const admin = await Admin.findOne({ email: data.email });

        if (admin && data.password === admin.password) {
            req.session.admin = true;
            req.session.loggedIn = true;
            req.session.name = admin.name;
            return res.redirect('/panel-admin');
        }

        // Buscar en los administradores creados desde registerAdmin
        const userAdmin = await UserAdmin.findOne({ email: data.email });

        if (userAdmin && data.password === userAdmin.password) {
            req.session.admin = true;
            req.session.loggedIn = true;
            req.session.name = userAdmin.name;
            return res.redirect('/panel-admin');
        }

        console.log("Credenciales incorrectas para administrador");
        return res.redirect('/log-in');
    };


    ///////////////////////////////////////////////////////////////////////////

    const existeUser = async () => {

        const usuario = await User.findOne({ email: data.email });

        if (usuario != null) {
            if (data.password == usuario.password) {

                req.session.loggedIn = true;
                req.session.cedula = usuario.cedula;
                req.session.name = usuario.name;
                req.session.email = usuario.email;
                req.session.phone = usuario.phone;
                req.session.userId = usuario._id;

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

    /* ESTO ES DEL PASADO PARA LOGEARSE CON LO DE EL SUPEOR ADMIN
    if (data.email == 'admin@gmail.com') {
        identificarAdmin();
    } else {
        existeUser();
    }*/

    // ESTE ES EL NUEVO PARA ACCESAR CON EL SUPER ADMIN Y EL ADMIN NORMAL////////////////////////

    // Verificar si es admin (ya sea el principal o uno creado por otro admin)
    const verificarAcceso = async () => {
        const adminPrincipal = await Admin.findOne({ email: data.email });
        const adminSecundario = await UserAdmin.findOne({ email: data.email });

        if (adminPrincipal && data.password === adminPrincipal.password) {
            req.session.admin = true;
            req.session.loggedIn = true;
            req.session.name = adminPrincipal.name;
            return res.redirect('/panel-admin');
        }

        if (adminSecundario && data.password === adminSecundario.password) {
            req.session.admin = true;
            req.session.loggedIn = true;
            req.session.name = adminSecundario.name;
            return res.redirect('/panel-admin');
        }

        // Si no es admin, buscar como usuario normal
        existeUser();
    };

    verificarAcceso();

});

app.get('/log-out', (req, res) => {

    req.session.destroy((error) => {
        if (error) {
            console.log('Error');
        }
        res.redirect('/')
    });
});

app.post('/registerAdmin', async (req, res) => {

    let data = new UserAdmin({
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
    res.redirect('/panel-admin');

});
// ==========================
// FORMS
// ==========================


app.post('/addEvent', async (req, res) => {
    try {
        // Crear el nuevo evento
        let evento = new Evento({
            eventName: req.body.evento,
            creatorName: req.body.creatorName,
            description: req.body.descripcion,
            phone: req.body.telefono,
            date: req.body.fecha,
            direction: req.body.ubicacion,
            creatorId: req.session.userId,
            status: 'pending'
        });

        // Guardar el evento en la base de datos
        const savedEvento = await evento.save();

        // Crear el ticket asociado
        let ticket = new Ticket({
            type: 'evento',
            publicationId: savedEvento._id, // Usar el ID del evento guardado
            title: req.body.evento, // Título del evento
            creatorName: req.session.name, // Nombre del usuario de la sesión
            status: 'pending'
        });

        // Guardar el ticket
        await ticket.save();

        console.log('Evento y ticket registrados');
        res.redirect('/form-evento');
    } catch (err) {
        console.log("ERROR", err);
        res.redirect('/form-evento');
    }
});

app.post('/addAnuncio', async (req, res) => {
    try {
        let anuncio = new Anuncio({
            anuncioName: req.body.anuncio,
            creatorName: req.body.creatorName,
            description: req.body.descripcion,
            date: req.body.fecha,
            creatorId: req.session.userId,
            status: 'pending'
        });

        const savedAnuncio = await anuncio.save();

        let ticket = new Ticket({
            type: 'anuncio',
            publicationId: savedAnuncio._id,
            title: req.body.anuncio,
            creatorName: req.session.name,
            status: 'pending'
        });

        await ticket.save();

        console.log('Anuncio y ticket registrados');
        res.redirect('/form-anuncio');
    } catch (err) {
        console.log("ERROR", err);
        res.redirect('/form-anuncio');
    }
});

app.post('/addEmprendimiento', async (req, res) => {
    try {
        let emprendimiento = new Emprendimiento({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            emprendedor: req.body.nombre,
            correo: req.body.correo,
            telefono: req.body.telefono,
            ubicacion: req.body.ubicacion,
            redSocial: req.body.redSocial,
            creatorId: req.session.userId,
            status: 'pending'
        });

        const savedEmprendimiento = await emprendimiento.save();

        let ticket = new Ticket({
            type: 'emprendimiento',
            publicationId: savedEmprendimiento._id,
            title: req.body.nombre,
            creatorName: req.session.name,
            status: 'pending'
        });

        await ticket.save();

        console.log('Emprendimiento y ticket registrados');
        res.redirect('/form-emprendimiento');
    } catch (err) {
        console.log("ERROR", err);
        res.redirect('/form-emprendimiento');
    }
});

app.post('/addReporte', async (req, res) => {
    try {
        const reporte = await new Reporte({
            reporte: req.body.reporte,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            tipo: req.body.tipo,
            notificado: req.body.notificado,
            correo: req.body.correo,
            status: 'pending',
            creatorId: req.session.userId
        }).save();

        await new Ticket({
            type: 'reporte',
            publicationId: reporte._id,
            title: req.body.reporte,
            creatorName: req.session.name,
            status: 'pending'
        }).save();

        res.redirect('/form-reporte');
    } catch (err) {
        console.error('ERROR', err);
        res.redirect('/form-reporte');
    }
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

// editar rutas

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


// ==========================
// EDITAR PUBLICACIONES
// ==========================

// Ruta para mostrar el formulario de edición de emprendimiento
app.get('/editar-emprendimiento', async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.redirect('/log-in');
        }

        const emprendimientoId = req.query.id;
        const emprendimiento = await Emprendimiento.findById(emprendimientoId);

        if (!emprendimiento) {
            return res.status(404).send('Emprendimiento no encontrado');
        }

        // Verificar que el usuario es el creador
        if (emprendimiento.creatorId.toString() !== req.session.userId.toString()) {
            return res.status(403).send('No tienes permiso para editar este emprendimiento');
        }

        res.render('forms/editar-emprendimiento.ejs', {
            emprendimiento: emprendimiento,
            emprendimientoId: emprendimientoId
        });
    } catch (error) {
        console.error("Error al obtener el emprendimiento:", error);
        res.redirect('/publicaciones');
    }
});

// Ruta para procesar la edición de emprendimiento
app.post('/actualizar-emprendimiento', async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.redirect('/log-in');
        }

        const emprendimientoId = req.body.id;
        const emprendimiento = await Emprendimiento.findById(emprendimientoId);

        // Verificar que el emprendimiento existe
        if (!emprendimiento) {
            return res.status(404).send('Emprendimiento no encontrado');
        }

        // Verificar que el usuario es el creador
        if (emprendimiento.creatorId.toString() !== req.session.userId.toString()) {
            return res.status(403).send('No tienes permiso para editar este emprendimiento');
        }

        // Crear una nueva versión pendiente de aprobación
        const updatedData = {
            nombre: req.body.emprendimiento,  // Nombre del negocio
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            emprendedor: req.body.nombre,     // Nombre del emprendedor
            correo: req.body.correo,
            telefono: req.body.telefono,
            ubicacion: req.body.ubicacion,
            redSocial: req.body.redSocial,
            creatorId: req.session.userId,
            status: 'pending', // Cambiar a pendiente para aprobación
            originalId: emprendimientoId // Referencia al original
        };

        // Crear nuevo emprendimiento (versión editada)
        const newEmprendimiento = new Emprendimiento(updatedData);
        const savedEmprendimiento = await newEmprendimiento.save();

        // Crear ticket para aprobación
        let ticket = new Ticket({
            type: 'emprendimiento',
            publicationId: savedEmprendimiento._id,
            title: req.body.nombre,
            creatorName: req.session.name,
            status: 'pending',
            isEdit: true,
            originalId: emprendimientoId
        });

        await ticket.save();

        res.redirect('/publicaciones');
    } catch (error) {
        console.error("Error al actualizar el emprendimiento:", error);
        res.redirect('/publicaciones');
    }
});

// GET editar-anuncio -> renderiza el formulario con datos precargados
app.get('/editar-anuncio', async (req, res) => {
    try {
        const anuncioId = req.query.id;
        const anuncio = await Anuncio.findById(anuncioId);

        if (!anuncio) return res.status(404).send('Anuncio no encontrado');

        res.render('forms/editar-anuncio.ejs', {
            anuncio: anuncio,
            anuncioId: anuncioId
        });
    } catch (err) {
        console.error('Error en GET /editar-anuncio:', err);
        res.redirect('/publicaciones');
    }
});

// POST actualizar-anuncio -> crea versión editada y ticket (pendiente)
app.post('/actualizar-anuncio', async (req, res) => {
    try {
        if (!req.session.loggedIn) return res.redirect('/log-in');

        const originalId = req.body.id;
        if (!originalId) {
            console.error('ID original no proporcionado');
            return res.status(400).send('Falta ID original');
        }

        const original = await Anuncio.findById(originalId);
        if (!original) {
            console.error('Anuncio original no encontrado:', originalId);
            return res.status(404).send('Anuncio original no encontrado');
        }

        // Crear nueva versión editada
        const editedAnuncio = new Anuncio({
            anuncioName: req.body.anuncio,
            description: req.body.descripcion,
            creatorName: req.body.nombre || req.session.name,
            date: req.body.fecha,
            creatorId: req.session.userId,
            status: 'pending',
            originalId: originalId
        });

        const savedEdited = await editedAnuncio.save();
        console.log('Nueva versión de anuncio creada:', savedEdited._id);

        // Crear ticket para la edición
        const ticket = new Ticket({
            type: 'anuncio',
            publicationId: savedEdited._id,
            title: req.body.anuncio,
            creatorName: req.session.name,
            status: 'pending',
            isEdit: true,
            originalId: originalId
        });

        await ticket.save();
        console.log('Ticket de edición creado:', ticket._id);

        res.redirect('/publicaciones');
    } catch (err) {
        console.error('Error en POST /actualizar-anuncio:', err);
        res.redirect('/publicaciones');
    }
});

// GET editar-evento (muestra el formulario con los datos precargados)
app.get('/editar-evento', async (req, res) => {
    try {
        if (!req.session.loggedIn) return res.redirect('/log-in');

        const eventoId = req.query.id;            // en tu publicaciones usas ?id=...
        if (!eventoId) return res.status(400).send('Falta id');

        const evento = await Evento.findById(eventoId);
        if (!evento) return res.status(404).send('Evento no encontrado');

        // Verificar que el usuario es el creador
        if (!evento.creatorId || evento.creatorId.toString() !== req.session.userId.toString()) {
            return res.status(403).send('No tienes permiso para editar este evento');
        }

        res.render('forms/editar-evento.ejs', {
            evento,
            eventoId
        });
    } catch (err) {
        console.error('Error en GET /editar-evento:', err);
        res.redirect('/publicaciones');
    }
});

// Ruta para mostrar el formulario de edición de evento
app.post('/actualizar-evento', async (req, res) => {
    try {
        if (!req.session.loggedIn) return res.redirect('/log-in');

        const originalId = req.body.id;
        if (!originalId) return res.status(400).send('Falta id original');

        const original = await Evento.findById(originalId);
        if (!original) return res.status(404).send('Evento original no encontrado');

        if (!original.creatorId || original.creatorId.toString() !== req.session.userId.toString()) {
            return res.status(403).send('No tienes permiso para editar este evento');
        }

        const creatorName = req.body.creatorName || req.session.name || original.creatorName;

        const updatedData = {
            eventName: req.body.evento,
            description: req.body.descripcion,
            phone: req.body.telefono,
            date: req.body.fecha,
            direction: req.body.ubicacion,
            creatorId: req.session.userId,
            creatorName: creatorName,
            status: 'pending',
            originalId: originalId
        };

        const editedEvent = new Evento(updatedData);
        const savedEdited = await editedEvent.save();

        const ticket = new Ticket({
            type: 'evento',
            publicationId: savedEdited._id,
            title: req.body.evento,
            creatorName: req.session.name,
            status: 'pending',
            isEdit: true,
            originalId: originalId
        });

        await ticket.save();

        res.redirect('/publicaciones');
    } catch (err) {
        console.error('Error en POST /actualizar-evento:', err);
        res.redirect('/publicaciones');
    }
});


// Ruta para mostrar el formulario de edición de reporte
app.get('/editar-reporte', async (req, res) => {
    try {
        if (!req.session.loggedIn) return res.redirect('/log-in');

        const reporteId = req.query.id;
        const reporte = await Reporte.findById(reporteId);

        if (!reporte) return res.status(404).send('Reporte no encontrado');

        // Verificar que el usuario es el creador
        if (reporte.creatorId.toString() !== req.session.userId.toString()) {
            return res.status(403).send('No tienes permiso para editar este reporte');
        }

        res.render('forms/editar-reporte.ejs', {
            reporte,
            reporteId
        });
    } catch (err) {
        console.error('Error en GET /editar-reporte:', err);
        res.redirect('/publicaciones');
    }
});

// Ruta para procesar la actualización del reporte
app.post('/actualizar-reporte', async (req, res) => {
    try {
        if (!req.session.loggedIn) return res.redirect('/log-in');

        const originalId = req.body.id;
        if (!originalId) return res.status(400).send('Falta id original');

        const original = await Reporte.findById(originalId);
        if (!original) return res.status(404).send('Reporte original no encontrado');

        if (original.creatorId.toString() !== req.session.userId.toString()) {
            return res.status(403).send('No tienes permiso para editar este reporte');
        }

        // Crear nueva versión editada
        const updatedData = {
            reporte: req.body.reporte,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            tipo: req.body.tipo,
            notificado: req.body.notificado,
            correo: req.body.correo,
            status: 'pending',
            creatorId: req.session.userId,
            originalId: originalId
        };

        const editedReport = new Reporte(updatedData);
        const savedEdited = await editedReport.save();

        // Crear ticket para aprobación
        const ticket = new Ticket({
            type: 'reporte',
            publicationId: savedEdited._id,
            title: req.body.reporte,
            creatorName: req.session.name,
            status: 'pending',
            isEdit: true,
            originalId: originalId
        });

        await ticket.save();

        res.redirect('/publicaciones');
    } catch (err) {
        console.error('Error en POST /actualizar-reporte:', err);
        res.redirect('/publicaciones');
    }
});


//AQUI MUESTRO EN CONSOLA LOS EVENTOS REGISTRADOS SOLO PARA PRUEBAS > MANTENER CODIGO DORMIDO
// const mostrar = async() => {
//     const eventos = await Evento.find();
//     console.log(eventos);
//     console.log("FIN DE LOS EVENTOS EN LA BD");
// }
//mostrar()


// ==========================
// APIS PÚBLICAS DE CONTENIDO
// ==========================
//OBTENER EVENTOS PARA PODER ENVIARLOS DESDE EL BACK, ESTO YA QUE AL PARECER NO SE PUEDE USAR DOM DESDE NODE JS, ENTONCES LO ENVIAMOS COMO UN PAQUETE HASTA EL FRONT END// Eventos aprobados
app.get('/api/eventos', async (req, res) => {
    try {
        const eventos = await Evento.find({ status: 'approved' });
        res.json(eventos);
    } catch (err) {
        console.error("Error obteniendo eventos:", err);
        res.status(500).json({ error: "Error al obtener eventos" });
    }
});

// Anuncios aprobados
app.get('/api/anuncios', async (req, res) => {
    try {
        const anuncios = await Anuncio.find({ status: 'approved' });
        res.json(anuncios);
    } catch (err) {
        console.error("Error obteniendo anuncios:", err);
        res.status(500).json({ error: "Error al obtener anuncios" });
    }
});

// Emprendimientos aprobados
app.get('/api/emprendimientos', async (req, res) => {
    try {
        const emprendimientos = await Emprendimiento.find({ status: 'approved' });
        res.json(emprendimientos);
    } catch (err) {
        console.error("Error obteniendo emprendimientos:", err);
        res.status(500).json({ error: "Error al obtener emprendimientos" });
    }
});

// Reportes aprobados
app.get('/api/reportes', async (req, res) => {
    try {
        const reportes = await Reporte.find({ status: 'approved' });
        res.json(reportes);
    } catch (err) {
        console.error("Error obteniendo reportes:", err);
        res.status(500).json({ error: "Error al obtener reportes" });
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



// ==========================
// TICKET MANAGEMENT
// ==========================

app.post('/admin/approve-ticket', async (req, res) => {
    if (!req.session.admin) return res.redirect('/');

    try {
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.error('Ticket no encontrado', ticketId);
            return res.redirect('/panel-admin');
        }

        let model;
        switch (ticket.type) {
            case 'anuncio': model = Anuncio; break;
            case 'evento': model = Evento; break;
            case 'emprendimiento': model = Emprendimiento; break;
            case 'reporte': model = Reporte; break;
            default:
                console.error('Tipo desconocido:', ticket.type);
                return res.redirect('/panel-admin');
        }

        if (ticket.isEdit && ticket.originalId) {
            // obtener editada y original
            const edited = await model.findById(ticket.publicationId).lean();
            const original = await model.findById(ticket.originalId);

            if (!edited) {
                console.error('Documento editado no encontrado:', ticket.publicationId);
                await Ticket.findByIdAndUpdate(ticketId, { status: 'rejected' });
                return res.redirect('/panel-admin');
            }

            if (!original) {
                // Promover la editada si por alguna razón original no existe
                await model.findByIdAndUpdate(edited._id, { status: 'approved' });
                await Ticket.findByIdAndUpdate(ticketId, { publicationId: edited._id, status: 'approved', isEdit: false, originalId: null });
                return res.redirect('/panel-admin');
            }

            // Campos a excluir
            const blacklist = ['_id', '__v', 'status', 'originalId', 'createdAt', 'updatedAt', 'creatorId'];

            // Obtener keys válidas del schema
            const schemaKeys = Object.keys(model.schema.paths).filter(k => !blacklist.includes(k));

            // Copiar valores desde edited al original (si vienen)
            for (const key of schemaKeys) {
                if (edited.hasOwnProperty(key)) original[key] = edited[key];
            }

            original.status = 'approved';
            await original.save();

            // **Actualizar ticket para que apunte al original antes de borrar**
            await Ticket.findByIdAndUpdate(ticketId, {
                publicationId: original._id,
                status: 'approved',
                isEdit: false,
                originalId: null
            });

            // eliminar la versión temporal (editada)
            await model.findByIdAndDelete(edited._id);

        } else {
            // publicación nueva -> aprobarla directamente
            await model.findByIdAndUpdate(ticket.publicationId, { status: 'approved' });
            await Ticket.findByIdAndUpdate(ticketId, { status: 'approved' });
        }

        res.redirect('/panel-admin');
    } catch (err) {
        console.error('Error al aprobar ticket:', err);
        res.redirect('/panel-admin');
    }
});


app.post('/admin/reject-ticket', async (req, res) => {
    if (!req.session.admin) return res.redirect('/');
    try {
        const { ticketId, publicationId, type } = req.body;
        let ticket = null;

        if (ticketId) {
            ticket = await Ticket.findById(ticketId);
        } else if (publicationId) {
            ticket = await Ticket.findOne({ publicationId, type }).sort({ createdAt: -1 });
        }

        if (!ticket) {
            console.warn('reject-ticket: ticket no encontrado', { ticketId, publicationId, type });
            return res.redirect('/panel-admin');
        }

        // Marcar ticket como rejected
        await Ticket.findByIdAndUpdate(ticket._id, { status: 'rejected' });

        // Actualizar la publicación SOLO si es una nueva publicación (no una edición)
        if (!ticket.isEdit) {
            let model;
            switch (type) {
                case 'anuncio': model = Anuncio; break;
                case 'evento': model = Evento; break;
                case 'emprendimiento': model = Emprendimiento; break;
                case 'reporte': model = Reporte; break;
                default: model = null;
            }

            if (model && ticket.publicationId) {
                await model.findByIdAndUpdate(ticket.publicationId, { status: 'rejected' });
            }
        }

        res.redirect('/panel-admin');
    } catch (error) {
        console.error('Error al rechazar ticket:', error);
        res.redirect('/panel-admin');
    }
});