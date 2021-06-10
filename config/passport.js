const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//referencia al modelo donde vamos a autenticar 

const Usuarios = require('../models/Usuarios')

//local strategy- login con credenciales propias (usuario y pass)

passport.use(
    new LocalStrategy(
        //default espera un usuario y password
        {
            usernameField : 'email',
            passwordField: 'password'
        },
        async(email,password,done)=>{

            try{
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1
                    }
                })
                //El usuario existe, pero el pass no es correcto
                

                if(!usuario.verificarPassword(password)){
                    //console.log("no correcto",usuario)
                    return done(null,false,{
                        message: 'El pass es incorrecto'
                    })
                }
                //console.log("correcto",usuario)
                //Email y pass existe
                return done(null, usuario)
    

            }catch(error){
                //ese usuario no existe
                //console.log("aqui esaa el usuarioclre errorssss",error)
                return done(null,false,{
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

//serializar el usuario ponerlo junt coom un obejet
passport.serializeUser((usuario,callback)=>{
    callback(null,usuario)
})

//deserializar el usuario
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario)
})

//exportar

module.exports = passport