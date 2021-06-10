const fs = require("fs");

exports.generateDocumentKey = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < 16; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.keyExists  = (filename, file_keys) => {
    for (let i = 0; i < file_keys.length; i++) {
        if(filename === file_keys[i].filename){
            return i;
       } 
    }
    return -1;
}
exports.affectKeyToFile = (key, filename, file_keys) => {
    file_keys.push({
        "key": key,
        "filename": filename

    })
}
exports.deleteFileKeyElement = (filename, file_keys) => {
    let index = -1;
    for (let i = 0 ; i < file_keys.length; i++) {
        if (file_keys[i].filename === filename){
            index = i;
            break;
        }
    }
   file_keys.splice(index, 1);
}
exports.deletePhysicalFile = async filename => {
    try {
        fs.unlinkSync(`./files/${filename}`);
        return "file successfully deleted !!!"
    } catch(error){
        return error;

    }
}

exports.affectsCachedUrlToFilename = (cachedUrl, filename, file_keys) => {
    for (let i = 0; i < file_keys.length; i++) {
        if(filename === file_keys[i].filename){
            file_keys[i].cachedUrl = cachedUrl;
            return;
       } 
    } 
}

exports.getCachedUrlFromfilename = (filename, file_keys) => {
    for (let i = 0; i < file_keys.length; i++) {
        if(filename === file_keys[i].filename){
             return file_keys[i].cachedUrl 
       } 
    }
}

exports.setStratingFlagToAlfrescoNodeUpdating = (filename, file_keys, flag) => {
    for (let i = 0; i < file_keys.length; i++) {
        if(filename === file_keys[i].filename){
             return file_keys[i].nodeAlfrescoUpdatingStarted  = true;  
       } 
    }
}

exports.getStratingFlagToAlfrescoNodeUpdating = (filename, file_keys) => {
    for (let i = 0; i < file_keys.length; i++) {
        if(filename === file_keys[i].filename){
             return file_keys[i].nodeAlfrescoUpdatingStarted;  
       } 
    }
}


exports.manageReturningFileInformation = () => {
    if (helpers.keyExists(`${req.body.nodeId}.${req.body.extension}`,file_keys) === -1) {
        helpers.affectKeyToFile(helpers.generateDocumentKey(), response.filename, file_keys);
        key = file_keys[file_keys.length - 1].key;
        const index = helpers.keyExists(response.filename, file_keys);
        key = file_keys[index].key;
    }
    res.json({ 
        key: key,
        filename: response.filename,
        extension : req.body.extension
     });
}

exports.filenameExists = (filename, file_keys) => {
    for (let i = 0; i < file_keys.length; i++) {
        if(filename === file_keys[i].filename){
             return i;  
       } 
    }
    return -1;
}


