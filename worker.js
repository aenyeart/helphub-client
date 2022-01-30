'use strict';

const Client = require('./lib/Client.js');
const customer = new Client('/help', /*customer's name*/);
const customerClient = client(`http://localhost:${PORT}/helpHub`);

function helpRequests(payload) {
  console.log(`Worker: Help is on the way' ${payload.ticketId}`);
  socket.emit = socket.connect('http://localhose:3000');
}

customerClient.on('join', (payload) => {
    console.log(`Worker: Ticket is in progress ${payload.ticketId}`);
    customerClient.emit('in-progress', payload);
  });
  
  customerClient.on('Complete', (payload) => {
    console.log(`Worker: ticket is complete ${payload.ticketId}`);