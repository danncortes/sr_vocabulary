import 'dotenv/config';
import mysql from 'mysql2/promise';
import terminal from '../terminal';

const { DB_HOST, DB_USER, DB_PASSWORD, DB } = process.env;

const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB,
    dateStrings: true
});

db.getConnection()
    .then(() => {
        terminal.green('Connected to the MySQL database');
    })
    .catch((err) => {
        terminal.red('Error connecting to the database', err);
    });

export default db;
