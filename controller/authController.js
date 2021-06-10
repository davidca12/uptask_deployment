const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const crypto= require('crypto')
const  Sequelize  = require('sequelize')

const Op = Sequelize.Op

const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email')

//aqui pudedes pasar las estrategias para autenticar face, gmal..
exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',

    //esto es pra hacerlo mas glbal
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
})

exports.usuarioAutenticado = (req,res,next) =>{
    //si esta autenticado 
    if(req.isAuthenticated()){
        return next()
    }

    //si no esta autenticado
    return res.redirect('/iniciar-sesion')
}
exports.cerrarSesion= (req,res) =>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion')
    })
}

//si el usuario es valido genera token
exports.enviarToken = async(req,res) =>{
    //verificar el usuario Existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where:{
        email
    }})

    if(!usuario){
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer')
    }

    //usuario existe
    
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000

    //guardar en la base de datoas
    await usuario.save()

    //url reste
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`
    console.log(resetUrl)

    //enviar el correo con el token 
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reestablecer-password'
    })

    //terminar la ejecucion

    req.flash('correcto','Se ha enviado un correo')
    res.redirect('/iniciar-sesion')
}   

exports.validarToken = async(req,res) =>{
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    })

    //si no lo encuentra
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/reestablecer')
    }
    res.render('resetPassword',{
        nombePagina: 'Reestablecer contraseña'
    })
}

//cambiar el passwrod por uno nuevo

exports.actualizarPassword= async(req,res) =>{
    
    //verifica el token valido pero tambien la fecha de expericion 
    const usuario =await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] :Date.now()
            }
        }
    })

    //verificamos si el usuario existe
    
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/reestablecer')
    }

    //haseaher el pasword //esto es por el body parser y por el nombre que le pusiste en html
    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null

    //guardar el nuevo password
    await usuario.save()

    req.flash('Correcto', 'Tu password se cambio correctamente')
    res.redirect('/iniciar-sesion')

    
}