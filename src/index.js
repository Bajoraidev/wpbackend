const express = require('express');
const cors = require('cors');

const { port } = require('./config');

const auth = require('./routes/v1/auth');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/v1/auth/', auth);

app.all('*', (req, res) => {
  res.status(400).send({ err: 'Page not found' });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
