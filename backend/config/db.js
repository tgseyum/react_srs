 
import  mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: 'localhost',
    user: 'yourusername',
    password: 'password',
    database: 'databasename',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
export default pool
//You shoul never keep your username and password in this file. Move it to the .env file.