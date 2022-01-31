'use strict';
// require in the { helpRequests } from mock
// grab one from that array, use value of customer name below
const Client = require('./lib/Client.js');
const { helpRequests } = require('./lib/mockData.js');

const newRequest = helpRequests[Math.floor(Math.random() * helpRequests.length)];
// console.log('newRequest', newRequest);
const customer = new Client('/help', newRequest.username);

customer.subscribe('connect', () => {
  // console.log(`You are connected to the HelpHub server, ${customer.username}`);
  let helpRequestData = {
    username: customer.username,
    description: newRequest.description,
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

