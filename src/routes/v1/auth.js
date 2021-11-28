/* eslint-disable newline-per-chained-call */
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { dbConfig, jwtSecret } = require('../../config');

const router = express.Router();

const userSchema = Joi.object({
  //full_name: Joi.string().min(2).max(20),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(6).max(20).required(),
});

//new user register

router.post('/register', async (req, res) => {
  let userInputs = req.body;
  // validates users input
  try {
    userInputs = await userSchema.validateAsync(userInputs);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect data provided' });
  }

  const encryptedPassword = bcrypt.hashSync(userInputs.password);

  // saves users input to DB
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO users (email, password) VALUES (${mysql.escape(
        userInputs.email,
      )}, '${encryptedPassword}' )`,
    );
    await con.end();
    return res.send({ data });
  } catch (err) {
    return res.status(500).send({ err: 'Issue. Try again!' });
  }
});

//user login

router.post('/login', async (req, res) => {
  let userInputs = req.body;

  // validates users input
  try {
    userInputs = await userSchema.validateAsync(userInputs);
  } catch (err) {
    return res.status(400).send({ err: 'Incorrect email or password!' });
  }

  //pulls data from DB about user by email
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT * FROM users 
      WHERE email = ${mysql.escape(userInputs.email)} LIMIT 1`,
    );
    await con.end();

    const answer = bcrypt.compareSync(userInputs.password, data[0].password);

    //validates password, sends token to user
    if (!answer) {
      return res.status(400).send({ err: 'Incorrect email or password!' });
    }
    const token = jwt.sign({ id: data[0].id, email: data[0].email }, jwtSecret);
    return res.send({ token });
  } catch (err) {
    return res.status(500).send({ err: 'Issue. Try again' });
  }
});

module.exports = router;
