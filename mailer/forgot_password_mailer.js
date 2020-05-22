const nodeMailer = require('../config/nodemailer');

// this is another way of exporting method
exports.newPassword = (reset) => {
    let htmlString = nodeMailer.renderTemplate({reset: reset}, '/forgotpassword/forgot_password.ejs');

    nodeMailer.transporter.sendMail({
        from: 'shubhamcdn5@gmail.com',   // ********************************** 
        to: reset.user.email,
        subject: 'Password Change Request!',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in sending mail', err); return;}

        console.log('Message sent', info);
        return;
    })
};