const express = require('express')
const router = express.Router();

//importar expres validator
const { body } = require('express-validator/check')


const proyectosController = require('../controller/proyectosController')
const tareasController = require('../controller/tareasController')
const usuariosController = require('../controller/usuariosController')
const authController = require('../controller/authController')
module.exports = function() {

    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
     )


    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formualarioProyecto 
    )
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto 
    )

    
    //lista proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    )

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formualarioEditar
    )
    
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto 
    )

    //Eliminar proyecto 
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    )

    //Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    )

    //actualizar tarea
    //patch solo cambia una parte del objeto, update es todo
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,    
        tareasController.cambiarEstadoTarea
    )


    //eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    )

    //crear cuenta
    router.get('/crear-cuenta',usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta)

    //iniciar sesion
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion',authController.autenticarUsuario)
    
    //cerrar sesin
    router.get('/cerrar-sesion', authController.cerrarSesion)
    

    //restablecer contraseña
    router.get('/reestablecer',usuariosController.formRestablcerPassword)
    router.post('/reestablecer',authController.enviarToken)
    router.get('/reestablecer/:token',authController.validarToken)
    router.post('/reestablecer/:token' , authController.actualizarPassword)
    return router
}



