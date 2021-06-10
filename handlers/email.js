const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util')
const emailConfig = require('../config/email')

//traer credenciasles

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port:emailConfig.port,
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
  });

  //general html
  const generarHTML = (archivo,opciones ={})=>{
      const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`,opciones)
      //agrega todos los estulos lineales
      return juice(html)
  }
exports.enviar = async (opciones )=>{
    const html = generarHTML(opciones.archivo,opciones)
    const text = htmlToText.fromString(html)
    let opcionesEmail = {
        from: 'Uptask <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text, // plain text body
        html , // html body
    };
    //como no sporat promise tenemos que utilizar util
    const enviarEmail = util.promisify(transport.sendMail,transport)
    return enviarEmail.call(transport,opcionesEmail)
}




  /*
let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
});*/
