/**
 * Created by jaric on 03.06.2015.
 */

var express = require('express');
var router = express.Router();

router.get("/todos", function(req, res){
    console.log("current TODOs length:", req.app.TODOs.length);
    res.send(req.app.TODOs);
});
router.post("/todo", function(req, res){
    //console.log("body:", req.body);
    if (req.body.text.length > 300) req.body.text = req.body.text.substring(0, 300);
    if (req.body.author.length > 100) req.body.author = req.body.author.substring(0, 100);
    req.app.writeTODO(req.body);
    res.send("new todo added successfully");
});

module.exports = router;
