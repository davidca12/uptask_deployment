 const Proyectos = require('../models/Proyectos')
 const Tareas = require('../models/Tareas')


 
 exports.proyectosHome = async (req,res)=>{
    const usuarioId = res.locals.usuario.id
    
    const proyectos = await Proyectos.findAll({
        where: {usuarioId}
    })

    res.render('index',{
        nombrePagina : 'Proyectos',
        proyectos
    })
}

exports.formualarioProyecto = async (req,res)=>{
    const usuarioId = res.locals.usuario.id
    
    const proyectos = await Proyectos.findAll({
        where: {usuarioId}
    })

    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async(req,res)=>{
    //Enviar a la consola lo que el usuario escribe hay que habilitar librería bodyParser
    
    //acceder a los valores
    //console.log(req.body)

    //validar que tengamos algo en el input, obtenemos la información del input
    const usuarioId = res.locals.usuario.id
    
    const proyectos = await Proyectos.findAll({
        where: {usuarioId}
    })

    const { nombre } = req.body

    let errores = []

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre'})
    }

    //si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            errores,
            nombrePagina : 'Nuevo Proyecto', 
            proyectos
        })
        console.log(errores)
    }else{
        //no hay errores
        //insertar en la db
        /*
        Proyectos.create({nombre})
            .then(()=>console.log('Nombre insertado correctamente'))
            .catch(error => console.log(error))*/ 
        //const url = slug(nombre).toLowerCase()

        const usuarioId = res.locals.usuario.id
        await Proyectos.create({nombre, usuarioId}) 
        res.redirect('/')   
    }
}

exports.proyectoPorUrl= async(req,res,next)=>{
    //su qyuero acceder res.send(req.params.url)
    //res.send('Listo')

    const usuarioId = res.locals.usuario.id
    
    const proyectosPromise =Proyectos.findAll({
        where: {usuarioId}
    })

    const proyectoPromise =  Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    })


    const[proyectos,proyecto] = await Promise.all([proyectosPromise, proyectoPromise])
    
    //consultar tareas del proyecto actual
    
    const tareas = await Tareas.findAll({
        where : {
            proyetoId : proyecto.id
        },
        //esto es para añadir toda la relación completa de tarea con proyecto y mostrarlo
        include : [
            {model:Proyectos}
        ]
    })

    //console.log('@@@@@auitarea @@', tareas)
    
    if(!proyecto) return next()

    //render a la vista
    res.render('tareas',{
        nombrePagina: 'Tareas del proyecto',
        proyecto, 
        proyectos,
        tareas
    })
}

exports.formualarioEditar = async(req,res)=>{

    const usuarioId = res.locals.usuario.id
    
    const proyectosPromise =Proyectos.findAll({
        where: {usuarioId}
    })

    const proyectoPromise =  Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    })

    const[proyectos,proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    //render a la vista
    res.render('nuevoProyecto',{
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}


exports.actualizarProyecto = async(req,res)=>{
   
    const usuarioId = res.locals.usuario.id
    
    const proyectos = await Proyectos.findAll({
        where: {usuarioId}
    })
    const { nombre } = req.body

    let errores = []

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre'})
    }

    //si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            errores,
            nombrePagina : 'Editar', 
            proyectos
        })
        console.log(errores)
    }else{


        console.log('@@@@@')
        await Proyectos.update(
            {nombre},
            {where : {
                id : req.params.id
            }}
        ) 
        res.redirect('/')   
    }
}

exports.eliminarProyecto = async(req,res,next)=>{
    /*req query o params
    console.log(req.query)*/

    const {urlProyecto} = req.query
    
    const resultado = await Proyectos.destroy({where: {url: urlProyecto}})
    
    if(!resultado){
        return next();
    }
    
    res.status(200).send('Proyecto eliminado correctamente')
}

