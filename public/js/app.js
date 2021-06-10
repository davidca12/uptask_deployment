//esto se extiende por toda la aplicación

import proyectos from './modulos/proyectos'
import tareas from './modulos/tareas'
import  { actualizarAvance } from './funciones/avance'

document.addEventListener('DOMContentLoaded', () =>{
    actualizarAvance()
})