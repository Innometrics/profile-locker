require('dotenv').config();

var request = require('request-promise');
var fs = require('fs');

module.exports = {profileLock: profileLock};

async function profileLock(id){
    return new Promise((resolve, reject)=>{
    const URL = `https://api.innomdc.com/v1/companies/${process.env.COMPANY_ID}/buckets/${process.env.BUCKET_ID}/profile-locks/${id}`
  
        request({
            "method":"PUT", 
            "uri": URL,
            "json": true,
            "body": {
                "id": id,
                "lock": true
              }
        }).then(res => {
            return resolve();
        }).catch((err) => {
            if(err.name == 'RequestError'){
                console.log("Rate Limit Hit!");
                return reject();
            }
            else if(err.name == 'StatusCodeError'){
                if(err.statusCode == 404){
                    console.log('Profile was not found')
                    fs.appendFile("logs.txt", profileid+ "\r\n", function (err) {
                        if (err) console.log(err)
                    });
                }
                else if(err.statusCode == 409) { 
                    console.log('Profile is already locked');
                }
            }
            else{
                console.log(err);
                fs.appendFile("logs.txt", profileid+ "\r\n", function (err) {
                    if (err) console.log(err)
                });
            }
        })
        })
}
