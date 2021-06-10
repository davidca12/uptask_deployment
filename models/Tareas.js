const Sequelize = require('sequelize')
const db = require ('../config/db')
const Proyectos = require('./Proyectos')

const Tareas = db.define('tareas',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey :true,
        autoIncrement:true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
})
Tareas.belongsTo(Proyectos)
/*Proyectos.hasMany(Tareas) esta tendría que ir en el otro modelo, es una relación un proyeto muchas tareas */

module.exports = Tareas