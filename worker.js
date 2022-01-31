'use strict';

const Client = require('./lib/Client.js');
const { workers } = require('./lib/mockData.js');
const workerName = workers.pop();
const worker = new Client('/help', workerName); // namespace is first arg to Client 

worker.subscribe('connect', () => {
  let payload = {
    username: this.username,
  };

  let isAvailable = true; // Do I need this?

  worker.subscribe('Ready for Request', (payload) => {
    console.log('You are now connected to the Help Hub server via socket #', payload.customerSocket);

    worker.publish('Standing By', payload);
  });

  worker.subscribe('Ticket Generated', () => {
    if (isAvailable) {
      worker.publish('Standing By', { worker: worker.username }); // TEST is worker.username a valid ref?
    }
  });

  worker.subscribe('Assigning Ticket', (payload) => {
    isAvailable = false;
    worker.emit('In-Progress', payload);
    setTimeout(() => {
      worker.emit('Complete', payload);
      isAvailable = true;
      worker.emit('Standing By', { worker: worker.username });
    }, 4000);
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
