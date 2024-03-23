const mysql = require('mysql')

const db_config = {
    host: "localhost",
    user: "root",
    password: "hsd010905",
    port: "3306",
    database: "goodagriculturalproductsmall"
}

// let sqlConnTemp = (sql, params) => {
//     return new Promise((resolve, reject) => {
//         let conn = mysql.createConnection(db_config);
//         conn.connect(err => {
//             if (err) {
//                 reject(err);
//             } else {
//                 conn.query(sql, params, (err, data, fields) => {
//                     err ? reject(err) : resolve(data);
//                 });
//             }
//             conn.end(err => {
//                 if (err) throw err;
//             });
//         });
//     });
// };

let sqlConn = (sql, params) => {
    return new Promise((resolve, reject) => {
        const pool = mysql.createPool(db_config);
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, params, (err, data, fields) => {
                    conn.release(); // 确保在查询完成后释放连接
                    err ? reject(err) : resolve(data);
                });
            }
        });
    });
};

module.exports = { sqlConn }