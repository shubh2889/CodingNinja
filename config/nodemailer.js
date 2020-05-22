const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'shubhamcdn5@gmail.com',
        pass: 'Qwerty3246'
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailer', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendering template', err); return;}

            mailHTML = template
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
};