const Usuarios = require("../models/Usuarios")
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req,res) =>{
    res.render('crearCuenta',{
        nombrePagina : 'Crear Cuenta en Upstak'
    })
}

exports.formIniciarSesion = (req,res) =>{
    //esto es porque esuchca los errores flash()
    const{error}  = res.locals.mensajes
    res.render('iniciarSesion',{
        nombrePagina : 'Iniciar sesión',
        error
    })
}

exports.crearCuenta = async(req,res) =>{
    //leer los dtaos
    const {email, password} = req.body

    try{
        await Usuarios.create({
            email,
            password
        })

        //crar una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
        

        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })

        //redirgir al usuario

        req.flash('correct','enviamos un correo.')
        res.redirect('/iniciar-sesion')
    } catch(error){
        req.flash('error',error.errors.map(error=>error.message))
        //console.log('erorres aqui',error.errors.message)
        res.render('crearCuenta',{
            nombrePagina : 'Crear Cuenta en Upstak',
            mensajes: req.flash(),
            email : email,
            password
        })
    }

    //crear el usuario


}

exports.formRestablcerPassword = (req,res) =>{
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer contraseña'
    })
}


//cambia el estado de una cuenta
exports.confirmarCuenta = async(req,res) =>{
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    //si no existe el usuario
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1
    await usuario.save()

    req.flash('correct', 'Cuenta activdad correctamente')
    res.redirect('/iniciar-sesion')
}