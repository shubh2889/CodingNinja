const User = require('../model/user');
const Reset = require('../model/reset_password');
const forgotPasswordMailer = require('../mailer/forgot_password_mailer');
const queue = require('../config/kue');
const forgotPasswordWoker = require('../worker/forgot_password_worker');
const fs = require('fs');
const path = require('path');


module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: user.name + ' | Profile',
            profile_user: user
        }); 
    });  
    
};

module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('multer error', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    
                    if(user.avatar){
                        if (fs.existsSync(path.join(__dirname, '..',user.avatar ))){
                            fs.unlinkSync(path.join(__dirname, '..',user.avatar ));
                        }    
                    }
                    // this is saving the path of the uploaded file into the avatar field in user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
            
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// render the signin page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }else{
        return res.render('user_signin',{
            title: 'Codeial | Sign In'
        })
    }
    
};

// render the signup page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }else{
        return res.render('user_signup',{
            title: 'Codeial | Sign Up'
        });
    }   
};

// get the sign up data

module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'confirm password does not match');
        return res.redirect('back');
    };

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return;}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return;}
                req.flash('success', 'Account created');
                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('error','User already exists');
            return res.redirect('back');
        }
    });
};

// sign in and create a session for the user

module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in');
    return res.redirect('/');
};

// log out and destroy session

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged out');

    return res.redirect('/');
}

// render forgot password page

module.exports.forgotPassword = function(req, res){
    return res.render('forgot_password',{
        title: 'Forgot Password'
    })
};

// enter email and generate accesstoken

module.exports.resetPassword = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            const accessToken = Math.random().toString(36).substring(7);

            let reset = await Reset.create({
                user: user._id,
                accessToken,
                isValid: true
            });
            if(reset){
                reset = await Reset.findById(reset._id).populate('user', '-password');
                let job = queue.create('forgotPassword', reset).save(function(err){
                    if(err){console.log('error in creating a queue', err); return;}

                    console.log('job enqueued', job.id);
                });
                req.flash("success", "Email sent succesfully");
            }
            // return res.render('', {});
        }else{
            req.flash("error", "Enter valid email address");
        }
        return res.redirect("/users/forgot-password");

    }catch(err){
        console.log('error', err);
        return;
    }
};

// to render reset password page

module.exports.resetPasswordPage = async function(req, res){
    try {
        const reset = await Reset.findOne({accessToken: req.params.id});
        if(reset.isValid){
            return res.render('reset_password',{
                accessToken: req.params.id,
                title: 'Reset Password'
            });
        }else{
            console.log('error in reset password controller');
            return res.redirect("/users/forgot-password");
        }
        
    } catch (error) {
        console.log("error----------------------->", error);
    }
};

// to updata password in database

module.exports.updatePassword = async function(req, res){
    try {
        const reset = await Reset.findOne({ accessToken: req.params.id });
        if (reset.isValid && req.body.password == req.body.confirm_password) {
            await User.findByIdAndUpdate(reset.user, { password: req.body.password });
            await Reset.findByIdAndUpdate(reset._id, { isValid: "false" });
            return res.redirect("/users/sign-in");
        }else{
            return res.redirect('/');
        }
    } catch (error) {
        console.log("error----------------------->", error);
    }
}