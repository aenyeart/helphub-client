'use strict';

const socketioClient = require('socket.io-client');
const HOST = process.env.HOST || 'http://localhost:3000';


class Client {
  constructor(namespace, username) {
    this.socket = socketioClient.connect(`${HOST}${namespace}`);
    this.username = username;
  } 

  subscribe(event, callback) {
    this.socket.on(event, callback);
  }

  publish(event, payload) {
    this.socket.emit(event, payload);
  }
}

module.exports = Client;