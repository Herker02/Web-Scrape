var scrape = require("../public/scripts/scrape");

var headlineController = require("../controllers/headline")
var noteController = require("../controllers/note")


module.exports = function(router) {
    router.get("/", function(req,res){
        res.render("home");
    });
    router.get("/saved", function(req,res){
        res.render("saved");
    });

    router.get("/api/fetch", function(req,res){
        headlineController.fetch(function(err,docs){
            if(!docs || docs.insertedCount === 0){
                res.json({
                    message: "No new articles today. Please try again tomorrow."
                })
            } else{
                res.json({
                    message: "Added" + docs.insertedCount + " new articles."
                });
            }
        });
    });
    router.get("/api/headline", function(req,res){
        var query = {};
        if(req.query.saved){
            query = req.query;
        }
        headlineController.get(query, function(data){
            res.json(data);
        });
    });
    router.delete("/api/headline/:id", function(req,res){
        var query = {};
        query._id = req.params.id;
        headlineController.delete(query, function(err,data){
            res.json(data);
        });
    });
    router.patch("/api/headline", function(req,res){
        headlineController.update(req.body, function(err,data){
            res.json(data);
        });
    });
    router.get("/api/note/:headline_id?", function(req,res){
        var query = {};
        if (req.params.headline_id){
            query._id = req.params.headline_id;
        }
        noteController.get(query, function(err,data){
            res.json(data);
        });
    });
    router.delete("/api/note/:id", function(req,res){
        var query = {};
        query._id = req.params.id;
        noteController.delete(query, function(err,data){
            res.json(data);
        });
    });
    router.post("/api/note", function(req,res){
        noteController.save(req.body, function(data){
            res.json(data);
        });
    });
}