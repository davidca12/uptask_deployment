const path = require('path')
const webpack = require('webpack')

module.exports = {
    //archivo de entrada
    entry: './public/js/app.js',
    output : {
        filename:'bundle.js',
        path: path.join(__dirname,'./public/dist')

    },
    module:{
        rules:[
            {
               //aqui le decimos que archivos va utilizar
               test: /\.m?js$/,
               use: {
                   loader: 'babel-loader',
                   options:{
                       presets: ['@babel/preset-env']
                   }
               }
            }
        ]
    }
}