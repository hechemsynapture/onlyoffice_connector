const axios = require('axios');
const fs = require("fs");
const thenRequest = require("then-request");
const syncRequest = require("sync-request");
const ALFRESCO_GET_CONTENT_URI = "/alfresco/api/-default-/public/alfresco/versions/1/nodes"

exports.getAlfrescoNodeContent = async (nodeId, fileExtension, url) => {
    let  file = "";
    if (url.indexOf("content") != -1){
      try {
        file = await thenRequest("GET", url, {
            'headers': {
                authorization: 'Basic ' + Buffer.from(process.env.ALFRESCO_LOGIN + ':' + process.env.ALFRESCO_PASSWORD, 'ascii').toString('base64')
              },
        });
        fs.writeFileSync(`./files/${nodeId}.${fileExtension}`, file.getBody());
     } catch (error) {
         return error;
     }
    }
    return { filename : `${nodeId}.${fileExtension}` };   
}

exports.updateAlfrescoNodeContent = (nodeId, body, filename) => {
    return new Promise((resolve, reject) => {
                newUrl = `http://${process.env.DOCUMENT_SERVER_HOST}:8081/${body.url.substr(body.url.indexOf("cache"),body.url.length)}`;
                data = syncRequest("GET", newUrl);
                fs.writeFileSync(`./files/${filename}`, data.getBody());
                var config = {
                    method: 'put',
                    url: `${process.env.ALFRESCO_API_URL}${ALFRESCO_GET_CONTENT_URI}/${nodeId}/content`,
                    headers: { 
                        authorization: 'Basic ' + Buffer.from(process.env.ALFRESCO_LOGIN + ':' + process.env.ALFRESCO_PASSWORD, 'ascii').toString('base64')
                    },
                    data : data.getBody()
                  };
                  axios(config)
                  .then(function (response) {
                    resolve(JSON.stringify(response.data));
                  })
                  .catch(function (error) {
                    reject(error);
        }); 
  })
}

