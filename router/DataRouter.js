var express = require('express'),
    moment = require('moment'),
    uuid = require('uuid/v1'),
    Q = require('q'),
    fs = require('fs');


var routes = function(){

    var DataRouter = express.Router();

    //getting all the messages from the file
    DataRouter.route('/')
        .get(function(req, res){
        
            var readPromise = readBlogFile();
        
            readPromise.then(function(jsonData){
                // read success, hence send back the data
                res.status(200);
                res.json(jsonData);
                
            },function(err){
                //read error
                console.log(err);
                res.status(400);
                res.send("Data error");
            });
            
        });

    // getting the archived messages from the file
    DataRouter.route('/archive')
        .get(function(req, res){
        
            var readPromise = readBlogFile();
        
            readPromise.then(function(jsonData){
                // get the archived files
                var result = getArchivedEntries(jsonData);
                
                res.status(200);
                res.json(jsonData);
                
            },function(err){
                //read error
                console.log(err);
                res.status(400);
                res.send("Data error");
            });
            
        });

    // getting the archived messages from the file
    DataRouter.route('/posted')
        .get(function(req, res){
        
            var readPromise = readBlogFile();
        
            readPromise.then(function(jsonData){
                // get the archived files
                var result = getPostedEntries(jsonData);
                
                res.status(200);
                res.json(jsonData);
                
            },function(err){
                //read error
                console.log(err);
                res.status(400);
                res.send("Data error");
            });
            
        });

    // getting the archived messages from the file
    DataRouter.route('/unread')
        .get(function(req, res){
        
            var readPromise = readBlogFile();
        
            readPromise.then(function(jsonData){
                // get the archived files
                var result = getUnreadEntries(jsonData);
                
                res.status(200);
                res.json(jsonData);
                
            },function(err){
                //read error
                console.log(err);
                res.status(400);
                res.send("Data error");
            });
            
        });
    
    // getting the archived messages from the file
    DataRouter.route('/discard')
        .get(function(req, res){
        
            var readPromise = readBlogFile();
        
            readPromise.then(function(jsonData){
                // get the archived files
                var result = getDiscardedEntries(jsonData);
                
                res.status(200);
                res.json(jsonData);
                
            },function(err){
                //read error
                console.log(err);
                res.status(400);
                res.send("Data error");
            });
            
        });

    // saving the posted data to the route
    DataRouter.route('/save')
        .post(function(req, res){

            // create the new object to be added
            var o = {};
            o._id = uuid();
            o.name = req.body.name || "Anonymous";
            o.date = moment(new Date()).format('YYYY-M-D HH:mm:ss');
            o.text = req.body.text || "Just a posting";
            o.user = req.body.user || "Undefined";
            o.details = {
                archived : false,
                discard : false,
                posted : false
            };
            console.log(o);
            // read the file
            fs.readFile(__dirname + '/data/blog.json','utf8', function(err, data){
                if (err) {
                    console.log(err);
                    res.status(400);
                    res.send("Error in getting data");
                }
                else{
                    var d = JSON.parse(data);
                    d.push(o);
                    var jsonData = JSON.stringify(d);
                    var writePromise = writeBlogFile(jsonData);
        
                    writePromise.then(function(){
                        // read success, hence send back the data
                        res.status(200);
                        res.send("Saved");

                    },function(err){
                        //read error
                        console.log(err);
                        res.status(400);
                        res.send("Data save error");
                    });
                }

            });
        });
    
    return DataRouter;
}

module.exports = routes;


/*  ---------- ---------------- ---------------------   FILE READING/WRITING FUNCTION ------------------    ---------------------   */

// wraps the file reading in a promise
function readBlogFile(){
    
    var deferred = Q.defer();
    
    fs.readFile(__dirname + '/data/blog.json','utf8',function(err,data){
        if(err){
            deferred.reject(err);
        }
        else{
            var o = JSON.parse(data);
            deferred.resolve(o);
        }
    });
    
    return deferred.promise;
}


//wrapper for writing file
function writeBlogFile(jsonData){
    
    var deferred = Q.defer();
    
    fs.writeFile(__dirname + '/data/blog.json',jsonData,'utf8',function(err){
        if(err){
            deferred.reject(err);
        }
        else{
            deferred.resolve("Saved");
        }
    });
    
    return deferred.promise;
    
}


/*  ---------- ---------------- ---------------------   DATA PROCESSING FUNCTION ------------------    ---------------------   */

// get the entries for which archived = true
function getArchivedEntries(jsonData){
    
    var result = [];
    
    for(entries of jsonData){
        if(entries.details.archived){
            result.push(entries);
        }
    }
    
    return result;
}


//get the unread entries( archived/discard/posted = false)
function getUnreadEntries(jsonData){
    
    var result = [];
    
    for(entries of jsonData){
        if(!entries.details.archived && !entries.details.discard && !entries.details.posted){
            result.push(entries);
        }
    }
    
    return result;
}

//get the posted entries( posted = true)
function getPostedEntries(jsonData){
    
    var result = [];
    
    for(entries of jsonData){
        if(entries.details.posted){
            result.push(entries);
        }
    }
    
    return result;
}

//get the discarded entries( discard = true)
function getDiscardedEntries(jsonData){
    
    var result = [];
    
    for(entries of jsonData){
        if(entries.details.discard){
            result.push(entries);
        }
    }
    
    return result;
}
