/**
 * Created by jaric on 03.06.2015.
 */

var express = require('express');
var router = express.Router();

var fs = require('fs');
var Docxtemplater = require('docxtemplater');

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

router.get("/doc", function(req, res){
//Load the docx file as a binary
    content = fs
        .readFileSync("./public/docs/jatt3.docx","binary");

    doc = new Docxtemplater(content);

//set the templateVariables
    doc.setData({
        "first_name":"Hipp",
        "last_name":"Edgar",
        "full_name": "Hi there",
        "phone":"0652455478",
        "description":"New Website",

        lastName: "Иванов",
        firstName: "Иван",
        patronymic: "Иванович"
    });

//apply them (replace all occurences of {first_name} by Hipp, ...)
    doc.render();

    var buf = doc.getZip()
        .generate({type:"nodebuffer"});

    fs.writeFileSync("./public/docs/output.docx",buf);

    //res.send("prolly done");
    //res.sendFile(__dirname + "/../public/docs/output.docx");
    res.send(buf);
});

module.exports = router;
