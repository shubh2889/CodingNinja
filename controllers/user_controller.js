const User = require('../model/user');

module.exports.profile = function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err, user){
            if(user){
                return res.render('user_profile',{
                    title: 'Profile page',
                    user: user
                });
            }

            return res.redirect('/users/sign-in');
        });
    }else{
        return res.redirect('/users/sign-in')
    }
};

// render the signin page
module.exports.signIn = function(req, res){
    return res.render('user_signin',{
        title: 'Codeial | Sign In'
    });
};

// render the signup page
module.exports.signUp = function(req, res){
    return res.render('user_signup',{
        title: 'Codeial | Sign Up'
    });
};

// get the sign up data

module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    };

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return;}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return;}

                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }
    });
};

//

module.exports.createSession = function(req, res){
    // steps to authenticate
    // find the user
    User.findOne({email:req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing in'); return;}

        // handle user found
        if(user){
            // handle password which don't match
            if(user.password != req.body.password){
                return res.redirect('back');
            }

            // handle session create
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');

        }else{
            // handle user not found
            return res.redirect('back');
        };
    });   
};