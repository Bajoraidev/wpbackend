const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

const { isLoggedIn } = require('../../middleware');
const { dbConfig } = require('../../config');

router.post('/', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO reservation (user_id, workplaceid, res_day, user_name) VALUES (${mysql.escape(
        req.body.user_id,
      )}, ${mysql.escape(req.body.workplaceid)}, ${mysql.escape(
        req.body.res_day,
      )}, ${mysql.escape(req.body.user_name)})`,
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'error, please try again!' });
  }
});

router.get('/', async (req, res) => {
  const query = `SELECT user_id, workplaceid, reg_timestamp, res_day, user_name from reservation
  `;
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'error, please try again!' });
  }
});

module.exports = router;
