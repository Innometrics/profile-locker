require('dotenv').config();

const { createReadStream } = require('fs');
const { createInterface } = require('readline');

var amqp = require('amqplib/callback_api');

let sentLines = 0;

amqp.connect(process.env.CLOUDAMQP_URL, function(err, connection) {
    if (err) {
        console.log(err);
    }

    connection.createChannel(function(err, channel) {
        if (err) {
            console.log(err);
        } 

        channel.assertQueue(process.env.QUEUE_NAME, {
            durable: true
        });

        const readline = createInterface({
            input: createReadStream(process.env.FILE_PATH),
            creadlinefDelay: Infinity
        });

        readline.on('line', (line) => {
            setTimeout(async () =>{
               await channel.sendToQueue(process.env.QUEUE_NAME, new Buffer(line), { 
                    persistent: true });
                    sentLines++;
            })        
        });
        
        readline.on('close', () => {
            console.log("Done reading.");
        }) 
    });
});
