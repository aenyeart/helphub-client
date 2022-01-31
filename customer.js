'use strict';
// require in the { helpRequests } from mock
// grab one from that array, use value of customer name below
const Client = require('./lib/Client.js');
const { helpRequests } = require('./lib/mockData.js');

const newRequest = helpRequests.pop();

const customer = new Client('/help', newRequest.username);

customer.subscribe('connect', () => {
  let payload = {
    username: this.username,
    description: newRequest.description,
  };
  
  customer.subscribe('Ready for Request', (payload) => {
    console.log('You are now connected to the Help Hub server via socket #', payload.customerSocket);
    
    customer.publish('Help Requested', payload);
  });

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

