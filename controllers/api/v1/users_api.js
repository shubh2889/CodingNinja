const User = require('../../../model/user');
const jwt = require('jsonwebtoken');


module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if (!user || user.password != req.body.password){
            return res.json(422, {
                message: 'invalid username or password'
            });
        }
        return res.json(200,{
            message: 'logged in, here is your token',
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '100000'})
            }
        })    
    }catch(err){
        console.log('error', err)
        return res.json(500, {
            message: 'Internal Server error'
        });
    }
   
} 