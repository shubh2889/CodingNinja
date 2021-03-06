const Post = require('../model/post');
const User = require('../model/user');

module.exports.home = async function(req, res){
    try{
        // populate the user for each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user likes'
            }
        }).populate('likes');

        let users = await User.find({});
        return res.render('home', {
            title: "Codeial | Home",
            posts : posts,
            all_users : users
        });
    }catch(err){
        console.log('Error', err);
        return;
    }
};

//module.export.actionName = function(req,res){}