module.exports.index = function(req, res){
    return res.json(200, {
        message: 'version 2 lists',
        posts: []
    })
};