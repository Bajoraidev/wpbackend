const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send({ msg: 'Success' });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
