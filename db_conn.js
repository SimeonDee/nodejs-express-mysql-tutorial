const mysql = require('mysql')

module.exports.connectDB = async () => {
    const mysql_conn = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    })
    
    await mysql_conn.connect((err) => {
        if(err) {
            console.log(err)
            process.exit(1)
        }
        console.log('connected to mysql database')
    })

    return mysql_conn
}