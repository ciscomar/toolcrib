
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  supportBigNumbers: true,
  host: process.env.DB_TOOLCRIB_HOST,
  user: process.env.DB_TOOLCRIB_USER,
  password: process.env.DB_TOOLCRIB_PASS,
  database: process.env.DB_CONN_TOOLCRIB
})



function query(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection)=> {
      if (err) return reject(err);
      connection.query(sql,(err, result)=> {
        connection.release();
        if (err) return reject(err);
        return resolve(result);
      })
    })
  })
}

module.exports = query;
