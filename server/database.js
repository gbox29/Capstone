const e = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'system_integ'
});

connection.connect((error) => {
    if(error){
        throw error;
    }else{
        console.log("MySQL Database is connected succesfully");
    }
});

module.exports = connection