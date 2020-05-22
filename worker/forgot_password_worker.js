const queue = require('../config/kue');

const forgotPasswordMailer = require('../mailer/forgot_password_mailer');

queue.process('forgotPassword', function(job, done){
    console.log('forgotPassword worker is processing a job', job.data);
    forgotPasswordMailer.newPassword(job.data);
    done();
});