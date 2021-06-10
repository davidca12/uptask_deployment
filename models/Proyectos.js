const Sequilize = require('sequelize')
const db = require('../config/db')

const slug = require('slug')
const shortid = require('shortid')

//le damos nombre al modelo proyectos es el nombre de la columna
const Proyectos = db.define('proyetos',{
    id: {
        type: Sequilize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    nombre : Sequilize.STRING(100),
    url: Sequilize.STRING(100)

},{
    hooks : {
        beforeCreate (proyecto){
            
            const url = slug(proyecto.nombre).toLowerCase()


            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
})

module.exports = Proyectos