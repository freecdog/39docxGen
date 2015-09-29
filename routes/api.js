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

function generateDoc(body, callback){
    //Load the docx file as a binary
    var data = {};
    data.publicPath = path.join('docs');
    data.dirPath = path.join(__dirname, '..', 'public', data.publicPath);
    data.filePath = path.join(data.dirPath, 'jatt3.docx');
    fs.readFile(data.filePath, "binary", function(err, content) {
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
        _.extend(newModel, body);

        doc.setData(newModel);

        //apply them (replace all occurences of {___} by ___, ...)
        doc.render();

        data.buf = doc.getZip()
            .generate({type:"nodebuffer"});

        data.filename = 'rep' + 'at' + (new Date()).getTime() + '.docx';
        data.finalFilePath = path.join(data.dirPath, data.filename);
        fs.writeFile(data.finalFilePath, data.buf, function(err){
            if (err) throw err;
            callback(data);
        });
    });
}

// it sends the least bytes (50557 bytes, 141016 for jatt3)
router.post("/doc", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    generateDoc(req.body, function(data){
        res.sendFile(data.finalFilePath);
    });
});

// TODO raw data sent, but saved incorrectly (0 bytes or 144kb corrupted file)
// it sends the most bytes (178596 bytes, 487034 for jatt3) and it saves 0 bytes doc, while bytes were sent, idk why
router.post("/docAsParamRaw", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    generateDoc(req.body, function(data){
        res.send( {
            doc: data.buf
        } );
    });
});

// it sends less bytes (67424 bytes, 188034 for jatt3)
router.post("/docAsParamBase64", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    generateDoc(req.body, function(data){
        res.send( {
            doc64: data.buf.toString('base64')
        } );
    });
});

// it sends link and then download file directly (67424 bytes, 39 + 141016 for jatt3)
router.post("/docAsLink", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    generateDoc(req.body, function(data){
        res.send( {
            link: data.publicPath + '/' + data.filename
        } );
    });
});

/*
// it sends the least bytes (50557 bytes)
router.post("/doc", function(req, res){

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //Load the docx file as a binary
    var dirPath = path.join(__dirname, '..', 'public', 'docs');
    var filePath = path.join(dirPath, 'jatt3.docx');
    fs.readFile(filePath, "binary", function(err, content) {
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

        var filename = 'rep' + 'at' + (new Date()).getTime() + '.docx';
        var finalFilePath = path.join(dirPath, filename);
        fs.writeFile(finalFilePath, buf, function (err) {
            if (err) throw err;
            res.sendFile(finalFilePath);
        });
    });

});

// it sends the most bytes (178596 bytes)
router.post("/docAsParamRaw", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //Load the docx file as a binary
    var dirPath = path.join(__dirname, '..', 'public', 'docs');
    var filePath = path.join(dirPath, 'jatt3.docx');
    fs.readFile(filePath, "binary", function(err, content) {
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

        var filename = 'rep' + 'at' + (new Date()).getTime() + '.docx';
        var finalFilePath = path.join(dirPath, filename);
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
    var filePath = path.join(dirPath, 'jatt3.docx');
    fs.readFile(filePath, "binary", function(err, content) {
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

        var filename = 'rep' + 'at' + (new Date()).getTime() + '.docx';
        var finalFilePath = path.join(dirPath, filename);
        fs.writeFile(finalFilePath, buf, function (err) {
            res.send( {
                doc64: buf.toString('base64')
            } );
        });
    });
});

// it sends link and then download file directly (67424 bytes)
router.post("/docAsLink", function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //Load the docx file as a binary
    var dirPath = path.join(__dirname, '..', 'public', 'docs');
    var filePath = path.join(dirPath, 'jatt3.docx');
    fs.readFile(filePath, "binary", function(err, content) {
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

        var filename = 'rep' + 'at' + (new Date()).getTime() + '.docx';
        var finalFilePath = path.join(dirPath, filename);
        fs.writeFile(finalFilePath, buf, function (err) {
            res.send( {
                link: 'docs' + '/' + filename
            } );
        });
    });
});
*/

module.exports = router;
