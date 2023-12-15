const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "barriostecorral@gmail.com",
        pass: "xmgbuxytdkdddciq"
    }
})

const sendEmail = async (email)=>{
    const mailOptions = {
        to: email,
        subject: "Bienvenido",
        html:`
            <div>
                <h1>Bienvenido ${email}</h1>
            </div>
        `
    }
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}

const sendEmailReset = async (email, nueva)=>{
    const mailOptions = {
        to: email,
        subject: "Cambio de Contraseña",
        html:`
            <div>
                <h1>Tu nueva contraseña es:  ${nueva}</h1>
            </div>
        `
    }
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}

const sendEmailRenta = async (email, datos)=>{
    const mailOptions = {
        to: email,
        subject: "Gracias Por Rentar",
        html:`
            <div>
                <h1>Gracias por la renta de ${datos.titulo}</h1>
                <br>
                <h4>Plataforma: ${datos.plataforma}</h4>
                <br>
                <h4>Fecha de Entrega: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}</h4>
                <br>
                <h4>Descripcion del producto:</h4>
                <br>
                <div>${datos.item_desc}</div>
                <br>
                <h5>${datos.descripcion}</h5>
            </div>
        `
    }
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}


module.exports = {transporter, sendEmail, sendEmailReset, sendEmailRenta}