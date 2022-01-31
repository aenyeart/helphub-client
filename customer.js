'use strict';
// require in the { helpRequests } from mock
// grab one from that array, use value of customer name below
const Client = require('./lib/Client.js');
const { helpRequests } = require('./lib/mockData.js');

const newRequest = helpRequests[Math.floor(Math.random() * helpRequests.length)];

const customer = new Client('/help', newRequest.username);

customer.subscribe('connect', () => {
  console.log(`You are connected to the HelpHub server, ${customer.username}`);
  let payload = {
    username: this.username,
    description: newRequest.description,
  };
  
  customer.subscribe('Ready For Request', (payload) => {
    console.log('You are now connected to the Help Hub server via socket #', payload.customerSocket);
    
    customer.publish('Help Requested', payload);
  });

  customer.subscribe('Ticket Generated', (payload) => {
    console.log('Your help ticket # is', payload); // TODO dbl check var name against server
  });

  customer.subscribe('Assigning Ticket', () => {
    console.log('A service worker is now addressing your problem.');
  });

  customer.subscribe('In-progress', () => {
    console.log('A service worker is now addressing your problem.');
  });

  customer.subscribe('Complete', () => {
    console.log('Your help request has been fulfilled.');
    customer.disconnect();
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

