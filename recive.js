#!/usr/bin/env node

var locker = require("./apicall");

var queue = 'idToLock';

var amqp = require('amqplib/callback_api');

let lockedIds = 0;

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
        channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        

        channel.consume(queue, function(message) {
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