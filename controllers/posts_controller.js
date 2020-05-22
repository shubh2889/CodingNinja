const Post = require('../model/post');
const Comment = require('../model/comment');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content : req.body.content,
            user: req.user._id
        })

        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'post created!'
            })
        }

        // req.flash('success', 'Post created');
        return res.redirect('back');
    }catch(err){
        console.log('error in creating post', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
    
};

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

     // id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id : req.params.id
                    },
                    message: "Post deleted"
                })
            }
            
            // req.flash('info', 'Post and associated comments deleted');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
    }catch(err){
        console.log('error in creating post', err);
        return res.redirect('back');
    }   
};