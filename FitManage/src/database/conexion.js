import mysql from 'mysql2';

const db = mysql.createConnection(
    {
        host: 'autorack.proxy.rlwy.net',
        user: 'root',
        password: 'cxFkDqrVOkIulejFNAzAevQVIWvCrNod',
        database: 'railway',
        port: 41338,
    }
);

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos conectada');
});


export default db;





