require('dotenv').config();

module.exports = {
  port: process.env.port || 8080,
  jwtSecret: process.env.JWT_SECRET,
  dbConfig: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_PSW,
    port: process.env.MYSQL_PORT,
  },
};
