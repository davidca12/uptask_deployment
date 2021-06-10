import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')

if(btnEliminar){
  btnEliminar.addEventListener('click',(e)=>{

      //accedemos al atributo del objeto 
      const urlProyecto = e.target.dataset.proyectoUrl
     
      Swal.fire({
          title: 'Quiers borrar este proyecto?',
          text: "Si lo eliminas no se puede recuperar",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, borrar!',
          cancelButtonText: 'No, cancelar!'
        }).then((result) => {
          if (result.isConfirmed) {

            const url = `${location.origin}/proyectos/${urlProyecto}`
            
            axios.delete(url,{params:{urlProyecto}})
              .then((respuesta)=>{
                  //console.log(respuesta)

                  Swal.fire(
                    'Proyecto Eliminado!',
                    respuesta.data,
                    'success'
                  )
                  setTimeout(()=>{
                      window.location.href = '/'
                  },3000)
              })
              .catch(()=>{
                Swal.fire({
                  type: 'error',
                  title: 'Hubo un error',
                  text: 'No se puede eliminar',
                  icon: 'warning',
                })
                /*setTimeout(()=>{
                    window.location.href = '/'
                },3000)*/
              })


          }
        })
  })
}

export default btnEliminar;