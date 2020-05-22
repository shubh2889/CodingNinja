const nodeMailer = require('../config/nodemailer');

// this is another way of exporting method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'shubhamcdn5@gmail.com',
        to: comment.user.email,
        subject: 'New Comment published!',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in sending mail', err); return;}

        console.log('Message sent', info);
        return;
    })
}