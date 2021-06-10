const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.agregarTarea = async(req,res,next) =>{
    //obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({where:{
        url : req.params.url
    } 
    })
    //leer el valor del input
    const {tarea} = req.body

    //esado 0 = incompleto y id de proyecto

    const estado = 0
    const proyetoId = proyecto.id

    //inserta en la base de datos
    const resultado = await Tareas.create({
        tarea,estado,proyetoId
    })
    if(!resultado){
        return next()
    }
    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`)
}

exports.cambiarEstadoTarea = async (req,res,next)=>{
    /*con esto accdes al patch que te han enviado
    console.log(req.params)*/
    const {id} = req.params
    const tarea = await Tareas.findOne({where:{
        id //como son iguales id : id
    }})
    //console.log(tarea)

    //cambiar el estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1 ;
    }
    tarea.estado= estado

    const resultado = await tarea.save() 

    if(!resultado) return next()
    res.status(200).send('Actualizado')
}

exports.eliminarTarea = async(req,res)=>{
    //podemos poner query porque se le esta pasando params
    console.log(req.query) //aqui toma el nombre que le psas por varible y por params lo que tengas en el royter :id
    const {id} =req.params
    const resultado = await Tareas.destroy({where :{id}})
    if(!resultado) return next();

    res.status(200).send('Elminado')

}