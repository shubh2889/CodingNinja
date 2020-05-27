// const Like = require('../model/likes');
// const Post = require('../model/post');
// const Comment = require('../model/comment');


// module.exports.toggleLike = async function(req, res){
//     try {
//         //  likes/toggle/?id
//         let likeable;
//         let deleted = false;

//         if(req.query.type == 'Post'){
//             likeable = await Post.findById(req.query.id).populate('likes');

//         }else{
//             likeable = await Comment.findById(req.query.id).populate('likes')
//         }

//         // check  if like already exist
//         let existingLike = await Like.findOne({
//             likeable: req.query.id,
//             onModel: req.query.type,
//             user: req.user_id
//         })
//         // if a like already exists
//         if(existingLike){
//             likeable.likes.pull(existingLike._id);
//             likeable.save();

//             existingLike.remove();
//             deleted = true;
//         }else{
//             // else make a new like
//             let newLike = await Like.create({
//                 user: req.user._id,
//                 likeable: req.query.id,
//                 onModel: req.query.type
//             });

//             likeable.likes.push(newLike._id);
//             likeable.save();
//         }
//         return res.status(200).json({
//             message: 'request successful',
//             data: {
//                 deleted: deleted
//             }
//         });

//     } catch (error) {
//         console.log(err);
//         return res.json(500, {
//             message: 'Internal Server error'
//         });
//     }
// }
