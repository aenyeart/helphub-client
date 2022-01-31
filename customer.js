'use strict';
// require in the { helpRequests } from mock
// grab one from that array, use value of customer name below
const Client = require('./lib/Client.js');
const customer = new Client('/help', /*customer's name*/);

customer.subscribe('connect', () => {
  let payload = {
    username: 'BillyBobJr',
    description: 'Help on lab 13',
  };
  
  customer.subscribe('In-progress', () => {
    console.log('A service worker is now addressing your problem.');
  });


  customer.publish('Help Requested', payload);
  customer.subscribe('Ticket Generated', (payload) => {
    console.log('Your help ticket # is', payload.id); // TODO dbl check var name against server
  });

  customer.subscribe('In-progress', () => {
    console.log('A service worker is now addressing your problem.');
  });

  customer.subscribe('Complete', () => {
    console.log('Your help request has been fulfilled.');
  });


});

