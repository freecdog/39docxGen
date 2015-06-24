/**
 * Created by jaric on 03.06.2015.
 */

var express = require('express');
var router = express.Router();

var _ = require('underscore');
var path = require('path');
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

// it sends the least bytes (50557 bytes)
router.post("/doc", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //Load the docx file as a binary
    var dirPath = path.join(__dirname, '..', 'public', 'docs');
    fs.readFile(path.join(dirPath, 'jatt3.docx'), "binary", function(err, content) {
        var doc = new Docxtemplater(content);

        //set the templateVariables
        // TODO there should be scheme
        var scheme = {
            lastName: "Иванов",
            firstName: "Иван",
            patronymic: "Иванович"
        };
        var newModel = {};
        _.extend(newModel, scheme);
        _.extend(newModel, req.body);

        doc.setData(newModel);

        //apply them (replace all occurences of {___} by ___, ...)
        doc.render();

        var buf = doc.getZip()
            .generate({type:"nodebuffer"});

        var finalFilePath = path.join(dirPath, 'rep' + ip + 'at' + (new Date()).getTime() + '.docx');
        fs.writeFile(finalFilePath, buf, function (err) {
            res.sendFile(finalFilePath);
        });
    });

});

// it sends the most bytes (178596 bytes)
router.post("/docAsParamRaw", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //Load the docx file as a binary
    var dirPath = path.join(__dirname, '..', 'public', 'docs');
    fs.readFile(path.join(dirPath, 'jatt3.docx'), "binary", function(err, content) {
        var doc = new Docxtemplater(content);

        //set the templateVariables
        // TODO there should be scheme
        var scheme = {
            lastName: "Иванов",
            firstName: "Иван",
            patronymic: "Иванович"
        };
        var newModel = {};
        _.extend(newModel, scheme);
        _.extend(newModel, req.body);

        doc.setData(newModel);

        //apply them (replace all occurences of {___} by ___, ...)
        doc.render();

        var buf = doc.getZip()
            .generate({type:"nodebuffer"});

        var finalFilePath = path.join(dirPath, 'rep' + ip + 'at' + (new Date()).getTime() + '.docx');
        fs.writeFile(finalFilePath, buf, function (err) {
            res.send( {
                doc: buf
            } );
        });
    });
});

// it sends less bytes (67424 bytes)
router.post("/docAsParamBase64", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //Load the docx file as a binary
    var dirPath = path.join(__dirname, '..', 'public', 'docs');
    fs.readFile(path.join(dirPath, 'jatt3.docx'), "binary", function(err, content) {
        var doc = new Docxtemplater(content);

        //set the templateVariables
        // TODO there should be scheme
        var scheme = {
            lastName: "Иванов",
            firstName: "Иван",
            patronymic: "Иванович"
        };
        var newModel = {};
        _.extend(newModel, scheme);
        _.extend(newModel, req.body);

        doc.setData(newModel);

        //apply them (replace all occurences of {___} by ___, ...)
        doc.render();

        var buf = doc.getZip()
            .generate({type:"nodebuffer"});

        var finalFilePath = path.join(dirPath, 'rep' + ip + 'at' + (new Date()).getTime() + '.docx');
        fs.writeFile(finalFilePath, buf, function (err) {
            res.send( {
                doc64: buf.toString('base64')
            } );
        });
    });
});

module.exports = router;
