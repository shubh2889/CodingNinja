const Comment = require('../model/comment');
const Post = require('../model/post');
const commentsMailer = require('../mailer/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../worker/comment_email_worker');
const Like = require('../model/likes');

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
            comment = await comment.populate('user', 'name email').execPopulate();

            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){console.log('error in creating a queue'); return;}

                console.log('job enqueued',job.id);
            })
            if (req.xhr){

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "comment created!"
                });
            }

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

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            comment.remove();
            
            let post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('error in deleting comment', err);
        return;
    }       
};