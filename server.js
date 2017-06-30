const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

const app = express();
app.use(bodyParser.json());

// send back all post from DATABASE_URL
app.get('/blogs', (req, res) => {
  Blog
    .find()
    .exec()
    .then(blogs => {
      res.json({
        blogs: blogs.map(
          (blog) => blog.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

// request by ID
app.get('/blogs/:id', (req, res) => {
  Blog
    .findById(req.params.id)
    .exec()
    .then(blog => res.json(blog.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
});
