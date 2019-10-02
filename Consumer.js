require('dotenv').config();

var locker = require("./apicall");
var amqp = require('amqplib/callback_api');

let lockedIds = 0;

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

        channel.prefetch(5);

        channel.consume(process.env.QUEUE_NAME, function(message) {
            console.log("Processing %s", message.content.toString());

            setTimeout(async () =>{
            locker.profileLock(message.content.toString()).then((resolve) => {
                lockedIds++;
                channel.ack(message);
            }).catch((reject) => {
                channel.nack(message);
            })
            }, 0,1);
        }, 
        { noAck: false 
        });
    });
    
   
});