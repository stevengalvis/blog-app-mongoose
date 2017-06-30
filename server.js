const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();
app.use(bodyParser.json());




app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
