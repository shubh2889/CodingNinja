const Post = require('../model/post');

module.exports.home = function(req, res){
    // populate the user
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        return res.render('home', {
            title: "Codeial | Home",
            posts : posts
        });
    })
};

//module.export.actionName = function(req,res){}