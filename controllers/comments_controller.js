const Comment = require('../model/comment');
const Post = require('../model/post');


module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save(); 
            req.flash('info', 'comment added');
            return res.redirect('/');     
        }
    }catch(err){
        console.log('error in creating comment', err);
        return;
    }   
};


module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();
            req.flash('info', 'comment deleted');

            let post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('error in deleting comment', err);
        return;
    }       
};