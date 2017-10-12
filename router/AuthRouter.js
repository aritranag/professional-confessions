var express = require('express'),
    moment = require('moment'),
    uuid = require('uuid/v1'),
    Q = require('q'),
    fs = require('fs');


var routes = function(){

    var AuthRouter = express.Router();

    AuthRouter.route('/check')
        .post(function(req, res){

            var userprofile = req.body && req.body.user ? req.body.user : null;

            if(userprofile){
                if(userprofile.id == "yRJjpbQUm1" || userprofile.id == 'nRyYvq7MZn'){
                    res.status(200);
                    res.send("Admin");
                }
                else{
                    res.status(400);
                    res.send("Not Admin");
                }
            }
            else{
                res.status(400);
                res.send("Not Admin");
            }
        });
    //userprofile.id == "yRJjpbQUm1" ||

    return AuthRouter;
}

module.exports = routes;


/*  ---------- ---------------- ---------------------   FILE READING/WRITING FUNCTION ------------------    ---------------------   */




/*  ---------- ---------------- ---------------------   DATA PROCESSING FUNCTION ------------------    ---------------------   */
