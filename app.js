const express = require('express');
const helpers  = require('./helpers');
const path = require('path');
const cors = require('cors')
const bodyParser = require("body-parser");
const app = express();
const file_keys = []
const syncRequest = require("sync-request");
const alfrescoService = require("./services/alfresco.service");
const ALFRESCO_GET_CONTENT_URI = "/alfresco/api/-default-/public/alfresco/versions/1/nodes";
require('dotenv').config();
const fs = require("fs");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('files'));
app.use('/onlyoffice-connector/getFile', express.static('files'));

app.post("/onlyoffice-connector/init", (req, res) => {
    try {
        let key = "";
        const urlToRequest = helpers.filenameExists(`${req.body.nodeId}.${req.body.extension}`, file_keys) !=  -1 ?  
        `./files/${req.body.nodeId}.${req.body.extension}`
        :`${process.env.ALFRESCO_API_URL}${ALFRESCO_GET_CONTENT_URI}/${req.body.nodeId}/content`
        console.log(urlToRequest);
        alfrescoService.getAlfrescoNodeContent(req.body.nodeId, req.body.extension, urlToRequest).then((response) => {
            if (helpers.keyExists(`${req.body.nodeId}.${req.body.extension}`,file_keys) === -1) {
                helpers.affectKeyToFile(helpers.generateDocumentKey(), response.filename, file_keys);
                key = file_keys[file_keys.length - 1].key;
                const index = helpers.keyExists(response.filename, file_keys);
                key = file_keys[index].key;
            }else {
                const index = helpers.keyExists(response.filename, file_keys);
                key = file_keys[index].key;
            }
            res.json({ 
                key: key,
                filename: response.filename,
                extension : req.body.extension
             });           
        }).catch((error) => {
            res.send(error);
        })
    }
    catch (ex) {
        console.log(ex)
        res.status(500);
        res.render("error", { message: "Server error" });
        return;
    }
});

app.post("/onlyoffice-connector/track", function (req, res) {
    console.log(req.body);  
     updateFile = function (response, body, path) {
        if (body.status === 2) {
            const filenameUpdating = req.query.filename;
            const index = helpers.keyExists(req.query.filename,file_keys);
            file_keys[index].key = helpers.generateDocumentKey();
            filename_extension_separation = req.query.filename.split('.');
            nodeId = filename_extension_separation[0];
            alfrescoService.updateAlfrescoNodeContent(nodeId,body, req.query.filename).then(() => {
                //helpers.deletePhysicalFile(req.query.filename);
            })
        }
        response.write("{\"error\":0}");
        response.end();
    }

    var readbody = function (request, response, path) {
        var content = "";  
        request.on("data", function (data) {
            content += data;
        });
        request.on("end", function () {
            var body = JSON.parse(content);
            updateFile(response, body, path);
        });
    }
    
    if (req.body.hasOwnProperty("status")) {
        updateFile(res, req.body, `./files/${req.query.filename}`);
    } else {
        readbody(req, res, "./files")
    }
});


app.get('/onlyoffice-connector/test',function(req,res){
    try {
        req.body = {};
        req.body.nodeId = "8820f446-c925-4b97-893e-3b14d2e8783b";
        req.body.extension = "docx";
        let key = "";
    
        const urlToRequest = helpers.filenameExists(`${req.body.nodeId}.${req.body.extension}`, file_keys) !=  -1 ?  
        `./files/${req.body.nodeId}.${req.body.extension}`
        :`${process.env.ALFRESCO_API_URL}${ALFRESCO_GET_CONTENT_URI}/${req.body.nodeId}/content`
        console.log(urlToRequest);

        alfrescoService.getAlfrescoNodeContent(req.body.nodeId, req.body.extension, urlToRequest).then((response) => {
            if (helpers.keyExists(`${req.body.nodeId}.${req.body.extension}`,file_keys) === -1) {
                helpers.affectKeyToFile(helpers.generateDocumentKey(), response.filename, file_keys);
                key = file_keys[file_keys.length - 1].key;
                const index = helpers.keyExists(response.filename, file_keys);
                key = file_keys[index].key;
            }else {
                const index = helpers.keyExists(response.filename, file_keys);
                key = file_keys[index].key;
            }
            console.log(key);
            res.render("test" , {
                key : key,
                filename:response.filename
            });           
        }).catch((error) => {
            res.send(error);
        })
    }
    catch (ex) {
        console.log(ex)
        res.status(500);
        res.render("error", { message: "Server error" });
        return;
    }

});
  
app.listen(process.env.APP_PORT, () => console.log(`Example app listening on port ${process.env.APP_PORT}!`));
