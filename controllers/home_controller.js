module.exports.home = function(req, res){
    return res.render('home', {
        title: "Home Page"
    });
}

//module.export.actionName = function(req,res){}