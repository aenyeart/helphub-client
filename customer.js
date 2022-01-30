'use strict';

const Client = require('./lib/Client.js');
const customer = new Client('/help', /*customer's name*/);
const mockData = require('./lib/mockData.js');

customer.subscribe('connect', () => {
  let payload = {
    username: mockData.username,
    description: mockData.description,
  };
  

  customer.publish('Help Requested', payload);
  customer.subscribe('Ticket Generated', (payload) => {
    console.log('Your help ticket # is', payload.ticketId); // TODO check var name 'ticketId' against server
  });

  customer.subscribe('In-progress', () => {
    console.log('A service worker is now addressing your problem.');
  });

  customer.subscribe('Complete', () => {
    console.log('Your help request has been fulfilled.');
  });


});

