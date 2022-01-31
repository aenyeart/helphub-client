'use strict';

const Client = require('./lib/Client.js');
const { workers } = require('./lib/mockData.js');
const workerName = workers.pop();
const worker = new Client('/help', workerName); // namespace is first arg to Client 

worker.subscribe('connect', () => {

  let workerData = {
    username: worker.username,
  };

  let isAvailable = true; // Do I need this?

  worker.subscribe('Ready For Request', (payload) => { // { clientSocket: socket.id }
    console.log(worker.username + ', you are now connected to the Help Hub server via socket #', payload.clientSocket);

    console.log('The Help Hub server is standing by');

    worker.publish('Standing By', { payload, username: worker.username });
  });

  worker.subscribe('Ticket Generated', () => {
    if (isAvailable) {
      worker.publish('Standing By', { worker: worker.username }); // TEST is worker.username a valid ref?
    }
  });

  worker.subscribe('Assigning Ticket', (payload) => {
    isAvailable = false;
    worker.publish('In-Progress', payload);
    // setTimeout(() => {
    worker.publish('Complete', payload);
    isAvailable = true;
    // worker.publish('Standing By', { worker: worker.username });
    // }, 4000);
  });

});

// when WORKER client signs in or completes a ticket, emits "standing by"
// SERVER on 'standing by' pops next ticket off queue, assigns to that WORKER via payload
// SERVER emits to CUSTOMER and WORKER 'assigning ticket'
// on 'assigning ticket' WORKER emits in-progress
// --> SERVER relays 'in-progress' to CUSTOMER
// setTimeout, WORKER emits 'Complete'
// --> SERVER relays 'complete' to CUSTOMER
// --> CUSTOMER logs 'complete', disconnects socket
// WORKER emits 'standing by'
