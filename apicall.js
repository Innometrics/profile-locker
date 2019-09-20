var request = require('request-promise');
var fs = require('fs');
module.exports = {profileLock: profileLock};

async function profileLock(id){
    const ids = id 
    const profileid = ids
    const URL = `https://api.innomdc.com/v1/companies/1072/buckets/my-first-bucket/profile-locks/${profileid}`
  
   
        request({
            "method":"PUT", 
            "uri": URL,
            "json": true,
            "body": {
                "id": profileid,
                "lock": true
              }
        }).catch((err) => {
            if(err.name == 'RequestError'){
                console.log("Rate Limit Hit!");
                process.exit(0);
            }
            else if(err.name == 'StatusCodeError'){
                if(err.statusCode == 404){
                    console.log('Profile was not found')
                    fs.appendFile("logs.txt", profileid+ "\r\n", function (err) {
                        if (err) console.log(err),
                        process.exit(0);
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
                process.exit(0);
            }
        })
          
}
