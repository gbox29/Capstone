const e = require('express');
const mysql = require('mysql2');

const DB = {
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bf49c8840bc699',
  password: 'c78727cb',
  database: 'heroku_cbe447dd6f94384',
}

//bf49c8840bc699:c78727cb@us-cdbr-east-06.cleardb.net/heroku_cbe447dd6f94384?reconnect=true

//const connection = mysql.createPool(DB);
const connection = mysql.createConnection(DB);

connection.on('error', (error) => {
  console.error('Database error:', error);
  if (error.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Connection to the database was lost. Reconnecting...');
    setTimeout(() => {
      connection.connect();
    }, 2000); // Wait 2 seconds before trying to reconnect
  } else {
    console.log(error);
  }
});

console.log('MySQL Database is connected successfully');

module.exports = connection;