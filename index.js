const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')


//importar las vairables
require('dotenv').config({path: 'variables.env'})

//helpers con algunas funciones

const helpers = require('./helpers')


//crear la conexión a la base de datos
const db = require('./config/db')

/*db.authenticate()
    .then(()=> console.log('conectado'))
    .catch(error => console.log(error))
esto es para conectar al servidor
    */

//importamos los modelos
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

//con sync te crea la estructura
db.sync()
    .then(()=> console.log('Conectad'))
    .catch(error=> console.log(error))

//crear una app de express
const app = express();

//habilitar bodyParser para leer datos
app.use(bodyParser.urlencoded({extended:true}))

//agregamos  express validator
app.use(expressValidator())

/*const productos = [
    {
        producto:'libro',
        precio:
    }
]

app.use('/', (req,res)=>{
    res.json(producto)
})


//Ruta para el home
app.use('/', (req,res)=>{
    res.send('hola')
})*/

//Donde cargar los  arcguvos estaticos
app.use(express.static('public'))



//HABITLITAR PUG

app.set('view engine', 'pug')

//AÑADIR LA CARPETA de las vistas
app.set('views', path.join(__dirname,'./views'))

//agre falsh
app.use(flash())

//sessiones nos permiten navegar por varias paginas sin auntenticar
app.use(session({
    secret:'supersecreto',
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//Pasr vardump a la apliación 
app.use((req,res,next)=>{
    
    res.locals.vardump = helpers.vardump
    res.locals.mensajes = req.flash()
    res.locals.usuario = {...req.user} || null
    
    next()
})



app.use('/', routes())

//puerto donde va a conectarse

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port,host,()=>{
    console.log('Funciona')
})

require('./handlers/email')