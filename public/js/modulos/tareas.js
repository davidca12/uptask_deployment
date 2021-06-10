import axios from "axios"
import Swal from 'sweetalert2'

import  { actualizarAvance } from '../funciones/avance'

const tareas = document.querySelector('.listado-pendientes')

if(tareas){
    tareas.addEventListener('click',(e)=>{
        //console.log(e.target.classList)
        if(e.target.classList.contains('fa-check-circle')){
            const icono= e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea
            console.log(icono)

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`

            //console.log(url)

            axios.patch(url, {idTarea})
                .then((respuesta)=>{
                    //console.log(respuesta)
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo')
                        actualizarAvance()
                    }
                })

        }

        if(e.target.classList.contains('fa-trash')){

            //tenemos que acceder al padre por eso parentElement porque es dos padres haica arriba
            const tareaHtml = e.target.parentElement.parentElement,
                idTarea=tareaHtml.dataset.tarea

                Swal.fire({
                    title: 'Quiers borrar este tarea?',
                    text: "Si lo eliminas no se puede recuperar",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, borrar!',
                    cancelButtonText: 'No, cancelar!'
                  }).then((result) => {
                    if (result.isConfirmed) { 
                        const url = `${location.origin}/tareas/${idTarea}`

                        axios.delete(url, { params: {idTarea}})
                            .then((res)=>{
                                if(res.status ===200){
                                    //elminar le nodo
                                    tareaHtml.parentElement.removeChild(tareaHtml)

                                    //opcional una alerta
                                    Swal.fire(
                                        'Tarea Eliminada',
                                        res.data,
                                        'success'
                                    )
                                    actualizarAvance()
                                }
                            })
                    }         
                })

        }
    })
}
export default tareas