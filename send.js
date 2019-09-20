const request = require('request-promise')
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

var amqp = require('amqplib/callback_api');

var queue = 'idToLock';
let sentLines = 0;

amqp.connect('amqp://localhost', function(err, connection) {
    if (err) {
        console.log(err);
    }
    connection.createChannel(function(err, channel) {
        if (err) {
            console.log(err);
        } 

        channel.assertQueue(queue, {
            durable: true
        });


        const readline = createInterface({
            input: createReadStream('pid.txt'),
            creadlinefDelay: Infinity
          });

        



        readline.on('line', (line) => {
            setTimeout(async () =>{
               await channel.sendToQueue(queue, new Buffer.from(line), { 
                    persistent: true });
                    sentLines++;
            })
                
            
        });
        
        readline.on('close', () => {
            setTimeout(function() {
                console.log("Done no more lines to read, ReadStream closed...");
                console.log('Sent %s messages to the queue...',sentLines);
                process.exit(0)
              }, sentLines / 10);
            
        }) 
    });
});